import { Recipe } from "../db/types";
import { ProductionTreeNode } from "../types/productionTypes";

export function calculateProductionChain(
  recipe: Recipe,
  targetRate: number,
  recipes: Recipe[],
  nodeIdPrefix: string = "",
  depth: number = 0
): ProductionTreeNode {
  // Calculate base machine count needed
  const baseOutput = recipe.outputs.find(o => o.id === recipe.itemId);
  if (!baseOutput) throw new Error("Invalid recipe: no matching output");
  
  const itemsPerMachine = (baseOutput.quantity * 60) / recipe.time; // Convert to items per minute
  const machineCount = Math.ceil(targetRate / itemsPerMachine);

  // Create node for current recipe
  const node: ProductionTreeNode = {
    id: `${nodeIdPrefix}${recipe.id}-${depth}`,
    recipeId: recipe.id,
    name: recipe.name,
    producerType: recipe.producers[0],
    producerCount: machineCount,
    isByproduct: false,
    inputs: []
  };

  // Calculate byproducts
  recipe.outputs.forEach(output => {
    if (output.id !== recipe.itemId) {
      const byproductRate = -((output.quantity * 60 * machineCount) / recipe.time);
      node.inputs?.push({
        id: `byproduct-${output.id}-${depth}`,
        recipeId: recipe.id,
        name: `${output.id} (${byproductRate.toFixed(1)}/min)`, // Use byproductRate in name
        producerType: recipe.producers[0],
        producerCount: 0,
        isByproduct: true
      });
    }
  });

  // Calculate inputs recursively
  recipe.inputs.forEach((input, index) => {
    const inputRecipe = recipes.find(r => r.itemId === input.id);
    if (!inputRecipe) return;

    const requiredInputRate = (input.quantity * 60 * machineCount) / recipe.time;
    const inputNode = calculateProductionChain(
      inputRecipe,
      requiredInputRate,
      recipes,
      `${nodeIdPrefix}${index}-`,
      depth + 1
    );
    
    node.inputs?.push(inputNode);
  });

  return node;
}
