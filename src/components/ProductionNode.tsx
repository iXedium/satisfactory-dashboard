// Filename: src/components/ProductionNode.tsx

import React, { memo } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ProductionTreeNode } from '../types/productionTypes';

interface ProductionNodeProps {
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
  targetRate: number;
  actualRate: number;
  excessRate: number;
  efficiency: number;
  onDelete?: (nodeId: string) => void;
  onRateChange?: (nodeId: string, newRate: number) => void;
  onRecipeChange?: (nodeId: string, newRecipeId: string) => void;
  alternateRecipes?: { id: string; name: string }[];
  machineIcon?: string;
}

const ProductionNode = memo(({ 
  id,
  recipeId,
  name,
  producerType,
  producerCount = 1,
  isByproduct = false,
  targetRate = 0,
  actualRate = 0,
  efficiency = 100,
  excessRate = 0,
  onDelete,
  onRateChange,
  onRecipeChange,
  alternateRecipes = [],
  machineIcon,
}: ProductionNodeProps) => {
  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(event.target.value);
    if (!isNaN(newRate) && newRate >= 0 && onRateChange) {
      onRateChange(id, newRate);
    }
  };

  const handleRecipeChange = (event: SelectChangeEvent<string>) => {
    if (onRecipeChange) {
      onRecipeChange(id, event.target.value);
    }
  };

  const getEfficiencyColor = (eff: number): string => {
    if (eff > 100) return 'error.main';
    if (eff < 100) return 'warning.main';
    return 'success.main';
  };

  const safeEfficiency = typeof efficiency === 'number' ? efficiency : 100;
  const safeTargetRate = typeof targetRate === 'number' ? targetRate : 0;
  const safeExcessRate = typeof excessRate === 'number' ? excessRate : 0;
  const safeProducerCount = typeof producerCount === 'number' ? producerCount : 1;

  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ py: 1 }}>
      <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: 1 }}>
        {machineIcon && (
          <img 
            src={`/icons/${machineIcon}.webp`} 
            alt={name} 
            style={{ width: 24, height: 24 }} 
          />
        )}
        <Typography variant="subtitle1">
          {name}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        {alternateRecipes.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Recipe</InputLabel>
            <Select
              value={recipeId}
              label="Recipe"
              onChange={handleRecipeChange}
            >
              {alternateRecipes.map((recipe) => (
                <MenuItem key={recipe.id} value={recipe.id}>
                  {recipe.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField
          size="small"
          label="Target Rate"
          type="number"
          value={safeTargetRate}
          onChange={handleRateChange}
          sx={{ width: 120 }}
        />
        
        <Typography
          variant="body2"
          sx={{
            color: getEfficiencyColor(safeEfficiency),
            fontWeight: 'bold',
          }}
        >
          {safeEfficiency.toFixed(1)}%
        </Typography>

        <Typography variant="body2">
          × {safeProducerCount} {producerType.type}
          {producerType.multiplier > 1 && ` (×${producerType.multiplier})`}
        </Typography>

        {safeExcessRate > 0 && (
          <Typography variant="body2" color="info.main">
            +{safeExcessRate.toFixed(1)}/min excess
          </Typography>
        )}

        {onDelete && (
          <IconButton
            size="small"
            onClick={() => onDelete(id)}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
});

ProductionNode.displayName = 'ProductionNode';

export default ProductionNode;
