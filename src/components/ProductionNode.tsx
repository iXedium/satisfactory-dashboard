// Filename: src/components/ProductionNode.tsx

import React from 'react';
import { Card, CardContent, Grid, TextField, Select, MenuItem, Typography, SelectChangeEvent } from '@mui/material';
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
  const item = items.find(i => i.id === node.name);

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
        {/* Item Name */}
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            fontWeight: 'bold',
            color: 'primary.main',
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 1
          }}
        >
          {item?.name || node.name}
        </Typography>

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

          {/* Excess Rate Input */}
          <Grid item xs={12} sm={2}>
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
            />
          </Grid>

          {/* Production Rate */}
          <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
            <Typography variant="h6" color="primary">
              {(node.actualRate + node.excessRate).toFixed(1)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

ProductionNode.displayName = 'ProductionNode';
