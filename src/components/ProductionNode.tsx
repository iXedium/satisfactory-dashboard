// Filename: src/components/ProductionNode.tsx

import React from 'react';
import { Card, CardContent, Grid, TextField, Select, MenuItem, Typography, SelectChangeEvent } from '@mui/material';
import { ProductionTreeNode } from '../types/productionTypes';
import { Recipe } from '../db/types';

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
  const handleExcessRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    onUpdate({ excessRate: value });
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

  // Calculate total production rate
  const totalRate = node.targetRate + node.excessRate;

  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Recipe Selection */}
          <Grid item xs={12} sm={3}>
            <Select
              fullWidth
              value={node.recipeId}
              onChange={handleRecipeChange}
              size="small"
            >
              {alternateRecipes.map(recipe => (
                <MenuItem key={recipe.id} value={recipe.id}>
                  {recipe.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Machine Settings */}
          <Grid item xs={6} sm={2}>
            <TextField
              fullWidth
              label="Machines"
              type="number"
              size="small"
              value={node.producerCount}
              onChange={handleMachineCountChange}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              fullWidth
              label="Multiplier"
              type="number"
              size="small"
              value={node.producerType.multiplier}
              onChange={handleMultiplierChange}
              inputProps={{ min: 0.1, step: 0.1 }}
            />
          </Grid>

          {/* Production Rates */}
          <Grid item xs={6} sm={2}>
            <Typography variant="caption" display="block">Required Rate</Typography>
            <Typography>{node.targetRate.toFixed(1)}/min</Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              fullWidth
              label="Excess"
              type="number"
              size="small"
              value={node.excessRate}
              onChange={handleExcessRateChange}
              inputProps={{ step: 0.1 }}
            />
          </Grid>

          {/* Total Rate and Efficiency */}
          <Grid item xs={6} sm={1}>
            <Typography variant="caption" display="block">Total</Typography>
            <Typography>{totalRate.toFixed(1)}/min</Typography>
          </Grid>
          <Grid item xs={6} sm={1}>
            <Typography 
              variant="caption" 
              display="block"
              color={node.efficiency < 90 ? 'warning.main' : 'success.main'}
            >
              {node.efficiency.toFixed(0)}%
            </Typography>
          </Grid>
        </Grid>

        {/* Byproducts */}
        {node.inputs?.filter(input => input.isByproduct).map(byproduct => (
          <Typography 
            key={byproduct.id} 
            variant="caption" 
            color="text.secondary"
            sx={{ display: 'block', mt: 1 }}
          >
            Byproduct: {byproduct.name} ({Math.abs(byproduct.actualRate).toFixed(1)}/min)
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
});

ProductionNode.displayName = 'ProductionNode';
