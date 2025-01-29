import { Recipe, Item } from '../db/types';

export interface Item {
  id: string;
  name: string;
  category: string;
  icon?: string;
  description?: string;
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
  in: { [itemId: string]: number };
  out: { [itemId: string]: number };
  time: number;  // in seconds
  row?: number;
  category?: string;
  flags?: string[];
  usage?: string;
  cost?: { [itemId: string]: number };
  inputs?: { id: string; quantity: number }[];  // For UI compatibility
  outputs?: { id: string; quantity: number }[]; // For UI compatibility
}

export interface ProductionTreeNode {
  id: string;
  recipeId: string;
  name: string;
  producerType: {
    type: string;
    multiplier: number;
    icon?: string;
  };
  producerCount: number;
  isByproduct: boolean;
  targetRate: number;  // Target production rate in items/minute
  actualRate: number;  // Actual production rate after calculations
  excessRate: number; // Additional production rate beyond what's needed
  efficiency: number;  // Current efficiency/overclock percentage
  inputs?: ProductionTreeNode[];
}

export interface ProductionRate {
  perMinute: number;
  perMachine: number;
  machineCount: number;
  efficiency: number;
}

export interface NodeStats {
  efficiency: number;
  powerUsage: number;
  inputRates: { [itemId: string]: number };
  outputRates: { [itemId: string]: number };
  byproducts: { [itemId: string]: number };
}

export interface ProductionSummary {
  totalNodes: number;
  totalMachines: number;
  totalPower: number;
  inputs: { [itemId: string]: number };
  outputs: { [itemId: string]: number };
  byproducts: { [itemId: string]: number };
  efficiency: {
    min: number;
    max: number;
    average: number;
  };
}

export interface RateModifier {
  type: 'overclock' | 'underclock' | 'multiplier';
  value: number;
  source?: string;
}

export interface ProductionChainState {
  nodes: ProductionTreeNode[];
  items: { [id: string]: Item };
  recipes: { [id: string]: Recipe };
  selectedNodeId?: string;
}

export interface ProductionAction {
  type: 'ADD_NODE' | 'REMOVE_NODE' | 'UPDATE_NODE' | 'SET_SELECTED_NODE';
  payload: any;  // Type this better based on the action
}
