// Filename: src/db/types.ts

export interface Item {
  id: string;
  name: string;
  category: string;
}

export interface Recipe {
  id: string;
  itemId: string; // The main output item ID
  name: string;
  time: number; // Time to produce in seconds
  inputs: { id: string; quantity: number }[]; // List of input items and their quantities
  outputs: { id: string; quantity: number }[]; // List of output items and their quantities
  producers: string[]; // Machines capable of producing this recipe
}


export interface DataJson {
  items: Item[];
  recipes: Recipe[];
}

export interface ProductionNode {
  id: string; // Unique identifier
  recipeId: string; // The ID of the recipe associated with this node
  name: string; // Name of the node (e.g., the item being produced)
  producerType: string; // The type of machine producing this node
  producerCount: number; // Number of machines producing this node
  isByproduct: boolean; // Whether this node is a byproduct
}

