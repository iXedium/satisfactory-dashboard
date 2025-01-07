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
