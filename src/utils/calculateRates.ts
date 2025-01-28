import { Recipe } from "../db/types";
import { ProductionTreeNode } from "../types/productionTypes";

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
export function calculateBaseRate(recipe: Recipe, machineMultiplier: number = 1): number {
  // Get the first output item's rate
  const [outputId, outputQty] = Object.entries(recipe.out)[0];
  return (outputQty * 60 * machineMultiplier) / recipe.time; // Items per minute
}

/**
 * Calculate all rates for a production node
 */
export function calculateNodeRates(
  recipe: Recipe,
  requiredRate: number,
  excessRate: number = 0,
  machineCount?: number,
  machineMultiplier: number = 1
): RateCalculation {
  const baseRate = calculateBaseRate(recipe, machineMultiplier);
  const totalDesiredRate = requiredRate + excessRate;
  
  // If machine count is provided, use it to calculate rates
  // Otherwise, calculate required machines based on total desired rate
  const actualMachineCount = machineCount ?? Math.ceil(totalDesiredRate / baseRate);
  const totalRate = baseRate * actualMachineCount;
  
  // Calculate efficiency based on total desired rate vs actual production
  const efficiency = (totalDesiredRate / totalRate) * 100;

  // Calculate input requirements based on total production
  const inputRates: { [itemId: string]: number } = {};
  const [mainOutputId, mainOutputQty] = Object.entries(recipe.out)[0];
  
  Object.entries(recipe.in).forEach(([inputId, inputQty]) => {
    const inputRatePerOutput = inputQty / mainOutputQty;
    inputRates[inputId] = totalRate * inputRatePerOutput;
  });

  return {
    baseRate,
    calculatedRate: requiredRate,
    totalRate,
    machineCount: actualMachineCount,
    efficiency,
    inputRates
  };
}

/**
 * Update a production node and its children with new rates
 */
export function updateProductionNode(
  node: ProductionTreeNode,
  recipes: Recipe[]
): ProductionTreeNode {
  const recipe = recipes.find(r => r.id === node.recipeId);
  if (!recipe) return node;

  // Calculate total required rate (target + excess)
  const totalRequiredRate = node.targetRate + node.excessRate;

  // Calculate rates based on total requirements
  const rates = calculateNodeRates(
    recipe,
    totalRequiredRate,
    node.producerCount,
    node.producerType.multiplier
  );

  // Update node with new calculations
  const updatedNode: ProductionTreeNode = {
    ...node,
    actualRate: rates.totalRate,
    producerCount: rates.machineCount,
    efficiency: rates.efficiency,
  };

  // Update input nodes with new required rates
  if (updatedNode.inputs) {
    updatedNode.inputs = updatedNode.inputs.map(input => {
      if (input.isByproduct) {
        // Calculate byproduct rate based on the main production
        const byproductQty = recipe.out[input.name];
        if (!byproductQty) return input;
        const byproductRate = (byproductQty * 60 * updatedNode.producerCount * updatedNode.producerType.multiplier) / recipe.time;
        return {
          ...input,
          actualRate: -byproductRate, // Negative to indicate production
        };
      }

      const inputRecipe = recipes.find(r => r.out.hasOwnProperty(input.name));
      if (!inputRecipe) return input;

      const inputRequirement = recipe.in[input.name];
      if (!inputRequirement) return input;

      // Calculate required input rate based on total production
      const [mainOutputId, mainOutputQty] = Object.entries(recipe.out)[0];
      const requiredInputRate = (inputRequirement / mainOutputQty) * totalRequiredRate;
      return updateProductionNode(
        { ...input, targetRate: requiredInputRate },
        recipes
      );
    });
  }

  return updatedNode;
} 