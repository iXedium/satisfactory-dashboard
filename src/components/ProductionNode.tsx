// Filename: src/components/ProductionNode.tsx

import React from 'react';
import { Card, CardContent, Grid, TextField, Select, MenuItem, Typography, SelectChangeEvent, useTheme, Box, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SpeedIcon from '@mui/icons-material/Speed';
import { ProductionTreeNode } from '../types/productionTypes';
import { Recipe } from '../db/types';
import { useStaticData } from '../hooks/useStaticData';

interface ProductionNodeProps {
  node: ProductionTreeNode;
  recipes: Recipe[];
  alternateRecipes: Recipe[];
  onUpdate: (updates: Partial<ProductionTreeNode>) => void;
}

export const ProductionNode: React.FC<ProductionNodeProps> = React.memo(({ 
  node, 
  recipes,
  alternateRecipes,
  onUpdate 
}) => {
  const { items } = useStaticData();
  const theme = useTheme();
  const item = items.find(i => i.id === node.name);
  const recipe = recipes.find(r => r.id === node.recipeId);

  const getMachineClockColor = (clock: number) => {
    if (Math.abs(clock - 100) < 0.01) return theme.palette.machineStates.optimal;
    return clock < 100 ? theme.palette.machineStates.underclocked : theme.palette.machineStates.overclocked;
  };

  const calculateMachineClock = () => {
    if (!recipe) return 0;
    const totalRate = node.actualRate + node.excessRate;
    const nominalRate = (60 / recipe.time) * recipe.out[node.name] * node.producerType.multiplier;
    return node.producerCount > 0 ? (totalRate / node.producerCount / nominalRate) * 100 : 0;
  };

  const machineClock = calculateMachineClock();

  const handleClockClick = (event: React.MouseEvent, clockValue: number) => {
    event.stopPropagation();
    const normalizedValue = (clockValue / 100).toFixed(5);
    navigator.clipboard.writeText(normalizedValue);
  };

  const handleExcessRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    onUpdate({ excessRate: value });
  };

  const handleClearExcess = (event: React.MouseEvent) => {
    event.stopPropagation();
    onUpdate({ excessRate: 0 });
  };

  const handleMaxExcess = (event: React.MouseEvent) => {
    event.stopPropagation();
    // Calculate excess needed to reach 100% clock
    const recipe = recipes.find(r => r.id === node.recipeId);
    if (!recipe) return;
    
    const targetRate = node.producerCount * (60 / recipe.time) * recipe.out[node.name] * node.producerType.multiplier;
    const excessNeeded = targetRate - node.actualRate;
    onUpdate({ excessRate: Math.max(0, excessNeeded) });
  };

  const handleMachineCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 1;
    onUpdate({ producerCount: value });
  };

  const handleRecipeChange = (event: SelectChangeEvent<string>) => {
    const recipeId = event.target.value;
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    onUpdate({ 
      recipeId,
      producerType: recipe.producers[0]
    });
  };

  const handleMultiplierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 1;
    onUpdate({ 
      producerType: {
        ...node.producerType,
        multiplier: value
      }
    });
  };

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
                color: 'primary.main',
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
              {recipe?.producers[0].type} ({(60 / (recipe?.time || 1)).toFixed(2)}/min)
            </Typography>
          </Grid>
          
          {/* Production Rate and Clock */}
          <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
            <Typography variant="h6" color="primary" sx={{ mb: 0.5 }}>
              {(node.actualRate + node.excessRate).toFixed(1)}/min
            </Typography>
            <Box 
              component="div" 
              onClick={(e) => handleClockClick(e, machineClock)}
              sx={{ 
                cursor: 'pointer',
                display: 'inline-block',
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
                  color: getMachineClockColor(machineClock),
                  fontWeight: 500
                }}
              >
                {machineClock.toFixed(2)}%
              </Typography>
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
            <TextField
              fullWidth
              label="Machines"
              type="number"
              size="small"
              value={node.producerCount}
              onChange={handleMachineCountChange}
              onClick={(e) => {
                e.stopPropagation();
                (e.target as HTMLInputElement).select();
              }}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Multiplier"
              type="number"
              size="small"
              value={node.producerType.multiplier}
              onChange={handleMultiplierChange}
              onClick={(e) => {
                e.stopPropagation();
                (e.target as HTMLInputElement).select();
              }}
              inputProps={{ min: 0.1, step: 0.1 }}
            />
          </Grid>

          {/* Excess Rate with embedded buttons */}
          <Grid item xs={12} sm={4}>
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .excess-controls': {
                  opacity: 1
                }
              }}
            >
              <TextField
                fullWidth
                label="Excess"
                type="number"
                size="small"
                value={node.excessRate}
                onChange={handleExcessRateChange}
                onClick={(e) => {
                  e.stopPropagation();
                  (e.target as HTMLInputElement).select();
                }}
                inputProps={{ step: 0.1 }}
                sx={{
                  '& .MuiInputBase-root': {
                    pr: '80px' // Make room for the buttons
                  }
                }}
              />
              <Box 
                className="excess-controls"
                sx={{ 
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  gap: 0.5,
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  px: 0.5
                }}
              >
                <IconButton 
                  size="small" 
                  onClick={handleClearExcess}
                  sx={{ 
                    p: 0.5,
                    '&:hover': { color: 'error.main' }
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={handleMaxExcess}
                  sx={{ 
                    p: 0.5,
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  <SpeedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

ProductionNode.displayName = 'ProductionNode';
