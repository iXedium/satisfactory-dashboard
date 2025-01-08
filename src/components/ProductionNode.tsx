// Filename: src/components/ProductionNode.tsx

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ButtonGroup,
  useTheme,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';  // Fixed the import path
import RemoveIcon from '@mui/icons-material/Remove';
import SettingsIcon from '@mui/icons-material/Settings';

interface ProductionNodeProps {
  id: string;
  recipeId: string;
  name: string;
  producerType: string;
  producerCount: number;
  isByproduct: boolean;
  onDelete?: (id: string) => void;
  onRateChange?: (id: string, newCount: number) => void;
  onRecipeChange?: (id: string, newRecipeId: string) => void;
  alternateRecipes?: { id: string; name: string; }[];
  itemIcon?: string;
  machineIcon?: string;
  machineMultiplier: number;
}

const ProductionNode: React.FC<ProductionNodeProps> = ({
  id,
  recipeId,
  name,
  producerType,
  producerCount,
  isByproduct,
  onDelete,
  onRateChange,
  onRecipeChange,
  alternateRecipes = [],
  itemIcon,
  machineIcon,
  machineMultiplier,
}) => {
  const theme = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: theme.shadows[3],
        color: theme.palette.text.primary,
        mb: 2,
        padding: 2,
        '&:hover': {
          boxShadow: theme.shadows[6],
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      <CardContent>
        {/* Header with Controls */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            {itemIcon && (
              <img 
                src={`/icons/${itemIcon}.webp`} 
                alt={name} 
                style={{ width: 24, height: 24 }} 
              />
            )}
            <Typography variant="h6">{name}</Typography>
            {isByproduct && (
              <Chip
                size="small"
                label="Byproduct"
                sx={{
                  backgroundColor: theme.palette.warning.main,
                  color: theme.palette.warning.contrastText,
                }}
              />
            )}
          </Box>
          <Box display="flex" gap={1}>
            <IconButton 
              size="small" 
              onClick={() => setShowSettings(!showSettings)}
              sx={{ color: theme.palette.primary.main }}
            >
              <SettingsIcon />
            </IconButton>
            {onDelete && (
              <IconButton 
                size="small" 
                onClick={() => onDelete(id)}
                sx={{ color: theme.palette.error.main }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Settings Panel */}
        {showSettings && (
          <Box sx={{ mt: 2, mb: 2, p: 1, backgroundColor: theme.palette.background.default, borderRadius: 1 }}>
            {alternateRecipes.length > 0 && (
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Recipe</InputLabel>
                <Select
                  value={recipeId}
                  label="Recipe"
                  onChange={(e) => onRecipeChange?.(id, e.target.value)}
                >
                  {alternateRecipes.map((recipe) => (
                    <MenuItem key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        )}

        {/* Producer Details */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            {machineIcon && (
              <img 
                src={`/icons/${machineIcon}.webp`} 
                alt={producerType} 
                style={{ width: 20, height: 20 }} 
              />
            )}
            <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
              {`${producerType} (×${machineMultiplier})`}
            </Typography>
          </Box>
          <ButtonGroup size="small">
            <IconButton 
              onClick={() => onRateChange?.(id, Math.max(0, producerCount - 1))}
              disabled={producerCount <= 1}
            >
              <RemoveIcon />
            </IconButton>
            <Typography sx={{ px: 2, py: 1 }}>{producerCount}</Typography>
            <IconButton 
              onClick={() => onRateChange?.(id, producerCount + 1)}
            >
              <AddIcon />
            </IconButton>
          </ButtonGroup>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductionNode;
