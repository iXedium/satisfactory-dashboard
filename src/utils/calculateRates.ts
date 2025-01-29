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
 * Calculate the nominal (base) rate per machine for a recipe
 */
export const calculateNominalRate = (recipe: Recipe, producerType: Producer): number => {
  const mainOutput = Object.entries(recipe.out)[0];
  const baseRate = (60 / recipe.time) * mainOutput[1];  // Convert to per minute
  return baseRate * producerType.multiplier;
};

/**
 * Calculate all rates for a production node
 */
export const calculateNodeRates = (node: ProductionTreeNode, recipe: Recipe): ProductionTreeNode => {
  // Calculate what this node can actually produce with current machines
  const maxRate = calculateBaseRate(recipe, node.producerType, node.producerCount);
  
  // The actual rate should match the target rate, but cannot exceed maxRate
  const actualRate = Math.min(node.targetRate, maxRate);
  
  console.log('🔄 calculateNodeRates:', {
    node: node.name,
    targetRate: node.targetRate,
    actualRate,
    maxRate,
    currentExcess: node.excessRate,
    producerDetails: {
      count: node.producerCount,
      multiplier: node.producerType.multiplier,
      recipeTime: recipe.time,
      recipeOutput: recipe.out[node.name]
    }
  });
  
  // Calculate efficiency based on actual vs max rate
  const efficiency = (actualRate / maxRate) * 100;

  // Calculate machine clock (actual production rate per machine vs nominal rate)
  const nominalRate = calculateNominalRate(recipe, node.producerType);
  const totalRate = actualRate + node.excessRate;
  const machineClock = node.producerCount > 0 
    ? (totalRate / node.producerCount / nominalRate) * 100 
    : 0;

  console.log('🔄 calculateNodeRates result:', {
    node: node.name,
    efficiency,
    machineClock,
    nominalRate,
    totalRate,
    details: {
      actualRate,
      excessRate: node.excessRate,
      maxRate,
      targetRate: node.targetRate
    }
  });

  return {
    ...node,
    actualRate,
    efficiency,
    machineClock
  };
};

/**
 * Update a production node and its children with new rates
 */
export const updateProductionNode = (node: ProductionTreeNode, recipes: Recipe[]): ProductionTreeNode => {
  const recipe = recipes.find(r => r.id === node.recipeId);
  if (!recipe) return node;

  console.log('🔄 updateProductionNode start:', {
    node: node.name,
    targetRate: node.targetRate,
    actualRate: node.actualRate,
    excessRate: node.excessRate,
    producerDetails: {
      count: node.producerCount,
      multiplier: node.producerType.multiplier,
      recipe: recipe.name
    }
  });

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

      console.log('🔄 Updating input requirements:', {
        parent: node.name,
        input: input.name,
        parentTotalRate: totalRate,
        ratio,
        requiredInputRate,
        currentInputRate: input.actualRate,
        currentInputExcess: input.excessRate,
        inputRecipeDetails: {
          recipe: inputRecipe.name,
          time: inputRecipe.time,
          producerCount: input.producerCount,
          multiplier: input.producerType.multiplier
        }
      });

      // Update the input node with its new target rate
      const updatedInput = {
        ...input,
        targetRate: requiredInputRate
      };

      console.log('🔄 updateProductionNode input update:', {
        input: input.name,
        newTargetRate: updatedInput.targetRate,
        newActualRate: updatedInput.actualRate,
        newExcessRate: updatedInput.excessRate
      });

      // Recursively update this input's entire chain
      return updateProductionNode(updatedInput, recipes);
    });
  }

  console.log('🔄 updateProductionNode end:', {
    node: node.name,
    finalTargetRate: updatedNode.targetRate,
    finalActualRate: updatedNode.actualRate,
    finalExcessRate: updatedNode.excessRate,
    finalTotalRate: updatedNode.actualRate + updatedNode.excessRate,
    finalEfficiency: updatedNode.efficiency,
    finalMachineClock: updatedNode.machineClock
  });

  return updatedNode;
}; 