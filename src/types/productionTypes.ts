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
