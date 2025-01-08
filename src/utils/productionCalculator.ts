import { Recipe } from "../db/types";
import { ProductionTreeNode } from "../types/productionTypes";

export function calculateProductionChain(
  recipe: Recipe,
  targetRate: number,
  recipes: Recipe[],
  nodeIdPrefix: string = "",
  depth: number = 0,
  recipeChain: Set<string> = new Set()
): ProductionTreeNode {
  // Check for circular dependencies
  if (recipeChain.has(recipe.id)) {
    // Return a simplified node for circular dependency
    return {
      id: `${nodeIdPrefix}${recipe.id}-${depth}`,
      recipeId: recipe.id,
      name: `${recipe.name} (Circular)`,
      producerType: recipe.producers[0],
      producerCount: 0,
      isByproduct: false,
      targetRate: targetRate,
      actualRate: 0,
      excessRate: 0,
      efficiency: 0,
      inputs: []
    };
  }

  // Add current recipe to chain
  recipeChain.add(recipe.id);

  // Calculate base machine count needed
  const baseOutput = recipe.outputs.find(o => o.id === recipe.itemId);
  if (!baseOutput) throw new Error("Invalid recipe: no matching output");
  
  const itemsPerMachine = (baseOutput.quantity * 60) / recipe.time; // Convert to items per minute
  const machineCount = Math.ceil(targetRate / itemsPerMachine);
  const actualRate = itemsPerMachine * machineCount;
  const efficiency = (targetRate / actualRate) * 100;

  // Create node for current recipe
  const node: ProductionTreeNode = {
    id: `${nodeIdPrefix}${recipe.id}-${depth}`,
    recipeId: recipe.id,
    name: recipe.name,
    producerType: recipe.producers[0],
    producerCount: machineCount,
    isByproduct: false,
    targetRate: targetRate,
    actualRate: actualRate,
    excessRate: actualRate - targetRate,
    efficiency: efficiency,
    inputs: []
  };

  // Calculate byproducts
  recipe.outputs.forEach(output => {
    if (output.id !== recipe.itemId) {
      const byproductRate = -((output.quantity * 60 * machineCount) / recipe.time);
      node.inputs?.push({
        id: `byproduct-${output.id}-${depth}`,
        recipeId: recipe.id,
        name: `${output.id} (${byproductRate.toFixed(1)}/min)`,
        producerType: recipe.producers[0],
        producerCount: 0,
        isByproduct: true,
        targetRate: 0,
        actualRate: byproductRate,
        excessRate: byproductRate,
        efficiency: 100,
        inputs: []
      });
    }
  });

  // Calculate inputs recursively
  recipe.inputs.forEach((input, index) => {
    const inputRecipe = recipes.find(r => r.outputs.some(o => o.id === input.id));
    if (!inputRecipe) return;

    const requiredInputRate = (input.quantity * 60 * machineCount) / recipe.time;
    const inputNode = calculateProductionChain(
      inputRecipe,
      requiredInputRate,
      recipes,
      `${nodeIdPrefix}${index}-`,
      depth + 1,
      new Set(recipeChain) // Pass a copy of the recipe chain
    );
    
    node.inputs?.push(inputNode);
  });

  return node;
}
