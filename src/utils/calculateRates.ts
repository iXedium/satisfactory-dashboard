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
  const baseOutput = recipe.outputs.find(o => o.id === recipe.itemId);
  if (!baseOutput) throw new Error("Invalid recipe: no matching output");
  return (baseOutput.quantity * 60 * machineMultiplier) / recipe.time; // Items per minute
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

  // Calculate input requirements based on total production rate
  const inputRates: { [itemId: string]: number } = {};
  recipe.inputs.forEach(input => {
    const baseOutput = recipe.outputs.find(o => o.id === recipe.itemId);
    if (!baseOutput) return;
    
    const inputRatePerOutput = input.quantity / baseOutput.quantity;
    inputRates[input.id] = totalRate * inputRatePerOutput;
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
  recipes: Recipe[],
  parentRequiredRate?: number
): ProductionTreeNode {
  const recipe = recipes.find(r => r.id === node.recipeId);
  if (!recipe) return node;

  // Calculate rates based on parent requirements or current settings
  const rates = calculateNodeRates(
    recipe,
    parentRequiredRate ?? node.targetRate,
    node.excessRate,
    node.producerCount,
    node.producerType.multiplier
  );

  // Update node with new calculations
  const updatedNode: ProductionTreeNode = {
    ...node,
    targetRate: rates.calculatedRate,
    actualRate: rates.totalRate,
    excessRate: rates.totalRate - rates.calculatedRate,
    producerCount: rates.machineCount,
    efficiency: rates.efficiency,
  };

  // Update input nodes with new required rates
  if (updatedNode.inputs) {
    updatedNode.inputs = updatedNode.inputs.map(input => {
      const inputRecipe = recipes.find(r => r.outputs.some(o => o.id === input.name));
      if (!inputRecipe || input.isByproduct) return input;

      return updateProductionNode(input, recipes, rates.inputRates[input.name]);
    });
  }

  // Calculate byproducts
  const byproducts = recipe.outputs
    .filter(output => output.id !== recipe.itemId)
    .map(output => {
      const byproductRate = (output.quantity * 60 * updatedNode.producerCount * updatedNode.producerType.multiplier) / recipe.time;
      return {
        id: `byproduct-${output.id}`,
        recipeId: recipe.id,
        name: output.id,
        producerType: recipe.producers[0],
        producerCount: 0,
        isByproduct: true,
        targetRate: 0,
        actualRate: -byproductRate, // Negative to indicate production
        excessRate: -byproductRate,
        efficiency: 100,
        inputs: []
      };
    });

  // Add byproducts to inputs
  updatedNode.inputs = [
    ...(updatedNode.inputs?.filter(input => !input.isByproduct) ?? []),
    ...byproducts
  ];

  return updatedNode;
} 