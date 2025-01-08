import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { 
  ProductionChainState, 
  ProductionAction, 
  ProductionTreeNode,
  Recipe,
  Item
} from '../types/productionTypes';

const initialState: ProductionChainState = {
  nodes: [],
  items: {},
  recipes: {},
};

const ProductionContext = createContext<{
  state: ProductionChainState;
  dispatch: React.Dispatch<ProductionAction>;
  calculateRates: (nodeId?: string) => void;
  addProductionNode: (itemId: string, recipeId: string, targetRate: number) => void;
  updateNodeRate: (nodeId: string, targetRate: number) => void;
  toggleNodeCollapse: (nodeId: string) => void;
} | undefined>(undefined);

function productionReducer(state: ProductionChainState, action: ProductionAction): ProductionChainState {
  switch (action.type) {
    case 'ADD_NODE':
      return {
        ...state,
        nodes: [...state.nodes, action.payload],
      };
    
    case 'REMOVE_NODE':
      return {
        ...state,
        nodes: state.nodes.filter(node => node.id !== action.payload),
      };
    
    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: state.nodes.map(node => 
          node.id === action.payload.id ? { ...node, ...action.payload.updates } : node
        ),
      };
    
    case 'SET_SELECTED_NODE':
      return {
        ...state,
        selectedNodeId: action.payload,
      };
    
    case 'TOGGLE_NODE_COLLAPSE':
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === action.payload ? { ...node, collapsed: !node.collapsed } : node
        ),
      };
    
    case 'UPDATE_RATES':
      return {
        ...state,
        nodes: action.payload,
      };
    
    default:
      return state;
  }
}

export function ProductionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productionReducer, initialState);

  const calculateRates = useCallback((startNodeId?: string) => {
    const nodes = [...state.nodes];
    const updatedNodes = calculateProductionRates(nodes, state.recipes, startNodeId);
    dispatch({ type: 'UPDATE_RATES', payload: updatedNodes });
  }, [state.nodes, state.recipes]);

  const addProductionNode = useCallback((itemId: string, recipeId: string, targetRate: number) => {
    const recipe = state.recipes[recipeId];
    if (!recipe) return;

    const newNode: ProductionTreeNode = {
      id: crypto.randomUUID(),
      recipeId,
      name: state.items[itemId]?.name || '',
      producerType: {
        type: recipe.producerType,
        multiplier: 1,
      },
      producerCount: 1,
      isByproduct: false,
      targetRate,
      actualRate: 0,
      excessRate: 0,
      efficiency: 100,
      inputs: [],
    };

    dispatch({ type: 'ADD_NODE', payload: newNode });
    calculateRates(newNode.id);
  }, [state.recipes, state.items, calculateRates]);

  const updateNodeRate = useCallback((nodeId: string, targetRate: number) => {
    dispatch({
      type: 'UPDATE_NODE',
      payload: { id: nodeId, updates: { targetRate } },
    });
    calculateRates(nodeId);
  }, [calculateRates]);

  const toggleNodeCollapse = useCallback((nodeId: string) => {
    dispatch({ type: 'TOGGLE_NODE_COLLAPSE', payload: nodeId });
  }, []);

  return (
    <ProductionContext.Provider value={{
      state,
      dispatch,
      calculateRates,
      addProductionNode,
      updateNodeRate,
      toggleNodeCollapse,
    }}>
      {children}
    </ProductionContext.Provider>
  );
}

export function useProduction() {
  const context = useContext(ProductionContext);
  if (context === undefined) {
    throw new Error('useProduction must be used within a ProductionProvider');
  }
  return context;
}

// Helper function to calculate production rates recursively
function calculateProductionRates(
  nodes: ProductionTreeNode[],
  recipes: { [id: string]: Recipe },
  startNodeId?: string
): ProductionTreeNode[] {
  const processNode = (node: ProductionTreeNode): ProductionTreeNode => {
    const recipe = recipes[node.recipeId];
    if (!recipe) return node;

    // Calculate base production rate per machine
    const baseRate = (60 / recipe.baseCraftTime) * recipe.outputs[0].amount;
    const requiredMachines = Math.ceil(node.targetRate / baseRate);
    
    // Calculate actual and excess rates
    const actualRate = baseRate * requiredMachines;
    const excessRate = actualRate - node.targetRate;
    const efficiency = (node.targetRate / actualRate) * 100;

    // Update node with calculated values
    const updatedNode = {
      ...node,
      producerCount: requiredMachines,
      actualRate,
      excessRate,
      efficiency,
    };

    // Calculate input requirements and create/update input nodes
    if (!node.inputs) {
      updatedNode.inputs = recipe.inputs.map(input => ({
        id: crypto.randomUUID(),
        recipeId: '', // This needs to be selected by the user
        name: input.itemId,
        producerType: { type: '', multiplier: 1 },
        producerCount: 1,
        isByproduct: false,
        targetRate: (input.amount / recipe.outputs[0].amount) * node.targetRate,
        actualRate: 0,
        excessRate: 0,
        efficiency: 100,
      }));
    } else {
      updatedNode.inputs = node.inputs.map(input => {
        const inputRecipe = recipes[input.recipeId];
        if (!inputRecipe) return input;
        
        const inputRequirement = recipe.inputs.find(req => req.itemId === input.name);
        if (!inputRequirement) return input;

        return {
          ...input,
          targetRate: (inputRequirement.amount / recipe.outputs[0].amount) * node.targetRate,
        };
      });
    }

    return updatedNode;
  };

  if (startNodeId) {
    return nodes.map(node => 
      node.id === startNodeId ? processNode(node) : node
    );
  }

  // Process all root nodes if no specific node is specified
  return nodes.map(processNode);
} 