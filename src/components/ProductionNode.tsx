// Filename: src/components/ProductionNode.tsx

import React, { useCallback, useMemo } from 'react';
import { Card, CardContent, Grid, TextField, Select, MenuItem, Typography, SelectChangeEvent, useTheme, Box, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SpeedIcon from '@mui/icons-material/Speed';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ProductionTreeNode } from '../types/productionTypes';
import { Recipe } from '../db/types';
import { useStaticData } from '../hooks/useStaticData';

interface ProductionNodeProps {
  node: ProductionTreeNode;
  recipes: Recipe[];
  alternateRecipes: Recipe[];
  onUpdate: (updates: Partial<ProductionTreeNode>) => void;
}

interface InputWithButtonsProps {
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onIncrease: () => void;
  onDecrease: () => void;
  label: string;
  step?: number;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
}

const cleanupMachineName = (name: string) => {
  // Remove -id and -mkX (where X is any number)
  let cleaned = name.replace(/-id$/, '').replace(/-mk\d+$/, '');
  
  // Split by hyphens and capitalize each word
  cleaned = cleaned.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return cleaned;
};

const InputWithButtons: React.FC<InputWithButtonsProps> = React.memo(({ 
  value, 
  onChange, 
  onIncrease, 
  onDecrease, 
  label, 
  step = 0.1,
  leftButton = <RemoveIcon fontSize="small" />,
  rightButton = <AddIcon fontSize="small" />
}) => (
    <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
      <IconButton
        size="small"
        onClick={(e) => { e.stopPropagation(); onDecrease(); }}
        sx={{
          borderRadius: '4px 0 0 4px',
          bgcolor: 'action.hover',
          '&:hover': { bgcolor: 'action.selected' },
          height: 'auto',
          mr: '-1px'
        }}
      >
        {leftButton}
      </IconButton>
      <TextField
        fullWidth
        label={label}
        type="number"
        size="small"
        value={value}
        onChange={onChange}
        onClick={(e) => {
          e.stopPropagation();
          (e.target as HTMLInputElement).select();
        }}
        inputProps={{ 
          step,
          style: { textAlign: 'center' },
          // Remove spinner arrows
          'aria-label': label,
          sx: {
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
              '-webkit-appearance': 'none',
              margin: 0
            },
            '&[type=number]': {
              '-moz-appearance': 'textfield'
            }
          }
        }}
      />
      <IconButton
        size="small"
        onClick={(e) => { e.stopPropagation(); onIncrease(); }}
        sx={{
          borderRadius: '0 4px 4px 0',
          bgcolor: 'action.hover',
          '&:hover': { bgcolor: 'action.selected' },
          height: 'auto',
          ml: '-1px'
        }}
      >
        {rightButton}
      </IconButton>
    </Box>
  ), (prevProps, nextProps) => {
    return prevProps.value === nextProps.value &&
           prevProps.label === nextProps.label &&
           prevProps.step === nextProps.step;
  });

InputWithButtons.displayName = 'InputWithButtons';

const ProductionNodeContent: React.FC<ProductionNodeProps> = ({ 
  node, 
  recipes,
  alternateRecipes,
  onUpdate 
}) => {
  const { items } = useStaticData();
  const theme = useTheme();
  
  // Memoize item and recipe lookups
  const item = useMemo(() => items.find(i => i.id === node.name), [items, node.name]);
  const recipe = useMemo(() => recipes.find(r => r.id === node.recipeId), [recipes, node.recipeId]);

  // Memoize machine clock calculation
  const { machineClock, totalRate } = useMemo(() => {
    if (!recipe) return { machineClock: 0, totalRate: 0 };
    const total = node.actualRate + node.excessRate;
    const nominalRate = (60 / recipe.time) * recipe.out[node.name] * node.producerType.multiplier;
    const clock = node.producerCount > 0 ? (total / node.producerCount / nominalRate) * 100 : 0;
    return { machineClock: clock, totalRate: total };
  }, [recipe, node.actualRate, node.excessRate, node.producerCount, node.producerType.multiplier, node.name]);

  // Memoize handlers
  const handleClockClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    const normalizedValue = (machineClock / 100).toFixed(5);
    navigator.clipboard.writeText(normalizedValue);
  }, [machineClock]);

  const handleExcessRateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    onUpdate({ excessRate: value });
  }, [onUpdate]);

  const handleClearExcess = useCallback(() => {
    onUpdate({ excessRate: 0 });
  }, [onUpdate]);

  const handleMaxExcess = useCallback(() => {
    if (!recipe) return;
    const targetRate = node.producerCount * (60 / recipe.time) * recipe.out[node.name] * node.producerType.multiplier;
    const excessNeeded = targetRate - node.actualRate;
    onUpdate({ excessRate: Math.max(0, excessNeeded) });
  }, [recipe, node.producerCount, node.actualRate, node.producerType.multiplier, node.name, onUpdate]);

  const handleMachineCountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 1;
    onUpdate({ producerCount: value });
  }, [onUpdate]);

  const handleRecipeChange = useCallback((event: SelectChangeEvent<string>) => {
    const recipeId = event.target.value;
    const selectedRecipe = recipes.find(r => r.id === recipeId);
    if (!selectedRecipe) return;
    onUpdate({ 
      recipeId,
      producerType: selectedRecipe.producers[0]
    });
  }, [recipes, onUpdate]);

  const handleMultiplierChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 1;
    onUpdate({ 
      producerType: {
        ...node.producerType,
        multiplier: Math.max(1, value)
      }
    });
  }, [node.producerType, onUpdate]);

  const handleMultiplierAdjust = useCallback((increase: boolean) => {
    const current = node.producerType.multiplier;
    const newValue = increase 
      ? current * 2 
      : current / 2;
    onUpdate({ 
      producerType: {
        ...node.producerType,
        multiplier: Math.max(1, newValue)
      }
    });
  }, [node.producerType, onUpdate]);

  const handleMachineAdjust = useCallback((increase: boolean) => {
    const newValue = increase 
      ? node.producerCount + 1 
      : Math.max(1, node.producerCount - 1);
    onUpdate({ producerCount: newValue });
  }, [node.producerCount, onUpdate]);

  // Memoize color getter
  const clockColor = useMemo(() => {
    if (Math.abs(machineClock - 100) < 0.01) return theme.palette.machineStates.optimal;
    return machineClock < 100 ? theme.palette.machineStates.underclocked : theme.palette.machineStates.overclocked;
  }, [machineClock, theme.palette.machineStates]);

  return node.isByproduct ? (
    // Byproduct Node
    <Card variant="outlined" sx={{ mb: 1, width: '100%', bgcolor: 'action.hover' }}>
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Byproduct: {item?.name || node.name}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ textAlign: 'right' }}>
          {Math.abs(node.actualRate).toFixed(1)}
        </Typography>
      </CardContent>
    </Card>
  ) : (
    // Regular Production Node
    <Card variant="outlined" sx={{ mb: 1, width: '100%' }}>
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        {/* Header Section */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          {/* Item Name and Machine Type */}
          <Grid item xs={12} sm={6}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                color: 'text.primary',
                pb: 0.5
              }}
            >
              {item?.name || node.name}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                display: 'block',
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1
              }}
            >
              {recipe?.producers[0].type ? cleanupMachineName(recipe.producers[0].type) : ''} ({(60 / (recipe?.time || 1)).toFixed(2)}/min)
            </Typography>
          </Grid>
          
          {/* Production Rate and Clock */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 2
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'text.primary',
                  fontWeight: 'bold'
                }}
              >
                {(node.actualRate + node.excessRate).toFixed(1)}
              </Typography>
              <Box 
                component="div" 
                onClick={(e) => handleClockClick(e)}
                sx={{ 
                  cursor: 'pointer',
                  py: 0.5,
                  px: 2,
                  borderRadius: 1,
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: clockColor,
                    fontWeight: 500
                  }}
                >
                  {machineClock.toFixed(2)}%
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center">
          {/* Recipe Selection */}
          <Grid item xs={12} sm={4}>
            <Select
              fullWidth
              value={node.recipeId}
              onChange={handleRecipeChange}
              size="small"
              onClick={(e) => e.stopPropagation()}
            >
              {alternateRecipes.map(recipe => (
                <MenuItem key={recipe.id} value={recipe.id}>
                  {recipe.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Machine Settings */}
          <Grid item xs={12} sm={2}>
            <InputWithButtons
              value={node.producerCount}
              onChange={handleMachineCountChange}
              onIncrease={() => handleMachineAdjust(true)}
              onDecrease={() => handleMachineAdjust(false)}
              label="Machines"
              step={1}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <InputWithButtons
              value={node.producerType.multiplier}
              onChange={handleMultiplierChange}
              onIncrease={() => handleMultiplierAdjust(true)}
              onDecrease={() => handleMultiplierAdjust(false)}
              label="×"
              step={1}
            />
          </Grid>

          {/* Excess Rate */}
          <Grid item xs={12} sm={4}>
            <InputWithButtons
              value={node.excessRate}
              onChange={handleExcessRateChange}
              onIncrease={handleMaxExcess}
              onDecrease={handleClearExcess}
              label="Excess"
              step={0.1}
              leftButton={<ClearIcon fontSize="small" />}
              rightButton={<SpeedIcon fontSize="small" />}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

ProductionNodeContent.displayName = 'ProductionNodeContent';

// Wrap the entire component with memo and a proper comparison function
export const ProductionNode = React.memo(ProductionNodeContent, (prevProps, nextProps) => {
  // Only re-render if these specific properties change
  return prevProps.node.id === nextProps.node.id &&
         prevProps.node.recipeId === nextProps.node.recipeId &&
         prevProps.node.producerCount === nextProps.node.producerCount &&
         prevProps.node.producerType.multiplier === nextProps.node.producerType.multiplier &&
         prevProps.node.actualRate === nextProps.node.actualRate &&
         prevProps.node.excessRate === nextProps.node.excessRate &&
         prevProps.node.targetRate === nextProps.node.targetRate &&
         prevProps.recipes === nextProps.recipes &&
         prevProps.alternateRecipes === nextProps.alternateRecipes;
});
