// Filename: src/db/types.ts

export interface Item {
  id: string;
  name: string;
  category: string;
  row: number;
  stack?: number;
  fuel?: {
    category: string;
    value: number;
  };
  belt?: {
    speed: number;
  };
  pipe?: {
    speed: number;
  };
  cargoWagon?: {
    size: number;
  };
  fluidWagon?: {
    capacity: number;
  };
  machine?: {
    speed: number;
    type: string;
    usage: number;
    modules?: number;
  };
  module?: {
    speed: number;
    consumption?: number;
    productivity?: number;
    limitation: string;
  };
}

export interface Producer {
  type: string;
  multiplier: number;
  icon?: string;
}

export interface Recipe {
  id: string;
  name: string;
  producers: Producer[];
  time: number;
  // Original format for UI compatibility
  inputs: { id: string; quantity: number }[];
  outputs: { id: string; quantity: number }[];
  // New format from data.json
  in: { [key: string]: number };
  out: { [key: string]: number };
  row?: number;
  category?: string;
  flags?: string[];
  usage?: number;
  cost?: number;
}

export interface DataJson {
  items: Item[];
  recipes: Recipe[];
}

export interface ProductionNode {
  id: string; // Unique identifier
  recipeId: string; // The ID of the recipe associated with this node
  name: string; // Name of the node (e.g., the item being produced)
  producerType: Producer; // The type of machine producing this node
  producerCount: number; // Number of machines producing this node
  isByproduct: boolean; // Whether this node is a byproduct
}

