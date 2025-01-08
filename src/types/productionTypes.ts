export interface Item {
  id: string;
  name: string;
  category: string;
  icon?: string;
  description?: string;
}

export interface Recipe {
  id: string;
  name: string;
  producerType: string;
  inputs: {
    itemId: string;
    amount: number;
  }[];
  outputs: {
    itemId: string;
    amount: number;
  }[];
  baseCraftTime: number;  // in seconds
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
  collapsed?: boolean; // For UI tree view state
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
  type: 'ADD_NODE' | 'REMOVE_NODE' | 'UPDATE_NODE' | 'SET_SELECTED_NODE' | 'TOGGLE_NODE_COLLAPSE' | 'UPDATE_RATES';
  payload: any;
}
