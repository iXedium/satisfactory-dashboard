import { Recipe, Producer } from '../db/types';
import { ProductionTreeNode } from '../types/productionTypes';

interface RateCalculation {
  baseRate: number;        // Base rate per machine
  calculatedRate: number;  // Rate required by parent
  totalRate: number;       // Total including excess
  machineCount: number;    // Required machines
  efficiency: number;      // Current efficiency
  inputRates: { [itemId: string]: number }; // Required input rates
}

/**
 * Calculate the base production rate for a recipe with given machine settings
 */
export const calculateBaseRate = (recipe: Recipe, producerType: Producer, producerCount: number): number => {
  const mainOutput = Object.entries(recipe.out)[0];
  const baseRate = (60 / recipe.time) * mainOutput[1];  // Convert to per minute
  return baseRate * producerType.multiplier * producerCount;
};

/**
 * Calculate all rates for a production node
 */
export const calculateNodeRates = (node: ProductionTreeNode, recipe: Recipe): ProductionTreeNode => {
  // Calculate what this node can actually produce with current machines
  const maxRate = calculateBaseRate(recipe, node.producerType, node.producerCount);
  
  // The actual rate should match the target rate for root nodes
  const actualRate = node.targetRate;
  
  // Calculate efficiency based on target vs max rate
  const efficiency = (actualRate / maxRate) * 100;

  return {
    ...node,
    actualRate,
    efficiency
  };
};

/**
 * Update a production node and its children with new rates
 */
export const updateProductionNode = (node: ProductionTreeNode, recipes: Recipe[]): ProductionTreeNode => {
  const recipe = recipes.find(r => r.id === node.recipeId);
  if (!recipe) return node;

  // First, update this node's rates
  let updatedNode = calculateNodeRates(node, recipe);
  const totalRate = updatedNode.actualRate + updatedNode.excessRate;

  // Then calculate and update input requirements
  if (updatedNode.inputs) {
    updatedNode.inputs = updatedNode.inputs.map(input => {
      if (input.isByproduct) return input;

      const inputRecipe = recipes.find(r => r.id === input.recipeId);
      if (!inputRecipe) return input;

      // Calculate how much input is needed based on the total rate (actual + excess)
      const mainOutput = Object.entries(recipe.out)[0];
      const inputAmount = recipe.in[input.name] || 0;
      const ratio = inputAmount / mainOutput[1];
      const requiredInputRate = ratio * totalRate;

      // Update the input node with its new target rate
      const updatedInput = {
        ...input,
        targetRate: requiredInputRate
      };

      // Recursively update this input's entire chain
      return updateProductionNode(updatedInput, recipes);
    });
  }

  return updatedNode;
}; 