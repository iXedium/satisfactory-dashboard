import { Recipe } from "../db/types";
import { ProductionRate } from "../types/productionTypes";

export function calculateMachineEfficiency(
  targetRate: number,
  recipe: Recipe,
  machineCount: number,
  multiplier: number = 1
): ProductionRate {
  const baseOutput = recipe.outputs.find(o => o.id === recipe.itemId);
  if (!baseOutput) throw new Error("Invalid recipe: no matching output");

  const itemsPerMachine = (baseOutput.quantity * 60 * multiplier) / recipe.time;
  const totalCapacity = itemsPerMachine * machineCount;
  const efficiency = (targetRate / totalCapacity) * 100;

  return {
    perMinute: targetRate,
    perMachine: itemsPerMachine,
    machineCount,
    efficiency: Math.min(efficiency, 250) // Cap at 250% (max overclock)
  };
}

export function calculateRequiredMachines(
  targetRate: number,
  recipe: Recipe,
  maxEfficiency: number = 100,
  multiplier: number = 1
): ProductionRate {
  const baseOutput = recipe.outputs.find(o => o.id === recipe.itemId);
  if (!baseOutput) throw new Error("Invalid recipe: no matching output");

  const itemsPerMachine = (baseOutput.quantity * 60 * multiplier) / recipe.time;
  const machineCount = Math.ceil(targetRate / (itemsPerMachine * (maxEfficiency / 100)));
  const efficiency = (targetRate / (itemsPerMachine * machineCount)) * 100;

  return {
    perMinute: targetRate,
    perMachine: itemsPerMachine,
    machineCount,
    efficiency
  };
}

export function formatRate(rate: number): string {
  return `${rate.toFixed(1)}/min`;
}

export function getEfficiencyColor(efficiency: number): string {
  if (efficiency > 100) return 'error';
  if (efficiency === 100) return 'success';
  return 'warning';
}
