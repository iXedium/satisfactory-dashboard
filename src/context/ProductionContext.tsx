import React, { createContext, useContext, useReducer } from 'react';
import { Recipe, Producer } from '../db/types';
import { ProductionTreeNode, ProductionChainState, ProductionAction } from '../types/productionTypes';
import { updateProductionNode } from '../utils/calculateRates';

const initialState: ProductionChainState = {
  nodes: [],
  items: {},
  recipes: {},
  selectedNodeId: undefined
};

const ProductionContext = createContext<{
  state: ProductionChainState;
  dispatch: React.Dispatch<ProductionAction>;
}>({
  state: initialState,
  dispatch: () => null
});

export const useProduction = () => useContext(ProductionContext);

const productionReducer = (state: ProductionChainState, action: ProductionAction): ProductionChainState => {
  switch (action.type) {
    case 'ADD_NODE': {
      const { recipe, targetRate } = action.payload;
      const timestamp = Date.now();
      const nodeId = `node-${timestamp}`;

      const newNode: ProductionTreeNode = {
        id: nodeId,
        recipeId: recipe.id,
        name: Object.keys(recipe.out)[0],
        producerType: {
          type: recipe.producers[0].type,
          multiplier: 1,
          icon: recipe.producers[0].icon
        },
        producerCount: 1,
        isByproduct: false,
        targetRate,
        actualRate: 0,
        excessRate: 0,
        efficiency: 100,
        inputs: []
      };

      // Create input nodes recursively
      const createInputNodes = (
        recipe: Recipe,
        parentRate: number,
        processedItems: Set<string> = new Set()
      ): ProductionTreeNode[] => {
        const nodes: ProductionTreeNode[] = [];

        // Process inputs
        Object.entries(recipe.in).forEach(([inputId, quantity]) => {
          if (processedItems.has(inputId)) return;

          const inputRecipes = Object.values(state.recipes)
            .filter(r => Object.keys(r.out).includes(inputId));
          
          if (!inputRecipes.length) return;

          const inputRecipe = inputRecipes[0];
          const mainOutput = Object.entries(recipe.out)[0];
          const inputRate = (quantity / mainOutput[1]) * parentRate;
          processedItems.add(inputId);

          const inputNode: ProductionTreeNode = {
            id: `${nodeId}-${inputId}`,
            recipeId: inputRecipe.id,
            name: inputId,
            producerType: {
              type: inputRecipe.producers[0].type,
              multiplier: 1,
              icon: inputRecipe.producers[0].icon
            },
            producerCount: 1,
            isByproduct: false,
            targetRate: inputRate,
            actualRate: 0,
            excessRate: 0,
            efficiency: 100,
            inputs: []
          };

          inputNode.inputs = createInputNodes(inputRecipe, inputRate, processedItems);
          nodes.push(inputNode);
        });

        return nodes;
      };

      newNode.inputs = createInputNodes(recipe, targetRate);
      const updatedNode = updateProductionNode(newNode, Object.values(state.recipes));

      return {
        ...state,
        nodes: [...state.nodes, updatedNode]
      };
    }

    case 'UPDATE_NODE': {
      const { nodeId, updates } = action.payload;
      const updatedNodes = state.nodes.map(node => {
        if (node.id === nodeId) {
          const updatedNode = { ...node, ...updates };
          return updateProductionNode(updatedNode, Object.values(state.recipes));
        }
        return node;
      });

      return {
        ...state,
        nodes: updatedNodes
      };
    }

    case 'REMOVE_NODE': {
      return {
        ...state,
        nodes: state.nodes.filter(node => node.id !== action.payload)
      };
    }

    case 'SET_SELECTED_NODE': {
      return {
        ...state,
        selectedNodeId: action.payload
      };
    }

    default:
      return state;
  }
};

export const ProductionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(productionReducer, initialState);

  return (
    <ProductionContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductionContext.Provider>
  );
}; 