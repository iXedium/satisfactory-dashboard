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
