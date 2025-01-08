import { ProductionTreeNode } from "./productionTypes";

export interface BuildState {
  id: string;
  name: string;
  timestamp: number;
  nodes: ProductionTreeNode[];
}

export interface Build {
  id: string;
  name: string;
  description?: string;
  created: number;
  modified: number;
  currentState: BuildState;
  savedStates: BuildState[];
}

export interface StateDiff {
  added: ProductionTreeNode[];
  removed: ProductionTreeNode[];
  modified: {
    before: ProductionTreeNode;
    after: ProductionTreeNode;
  }[];
}
