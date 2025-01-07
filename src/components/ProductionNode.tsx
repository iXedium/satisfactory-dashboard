// Filename: src/components/ProductionNode.tsx

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  useTheme,
} from "@mui/material";

interface ProductionNodeProps {
  id: string;
  recipeId: string;
  name: string;
  producerType: string;
  producerCount: number;
  isByproduct: boolean;
}

const ProductionNode: React.FC<ProductionNodeProps> = ({
  name,
  producerType,
  producerCount,
  isByproduct,
}) => {
  const theme = useTheme(); // Access theme for colors
  return (
    <Card
      sx={{
        backgroundColor: theme.palette.background.paper, // Use theme background color
        borderRadius: 2,
        boxShadow: theme.shadows[3], // Use theme shadow
        color: theme.palette.text.primary, // Use theme text color
        mb: 2,
        padding: 2,
      }}
    >
      <CardContent>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6">{name}</Typography>
          {isByproduct && (
            <Chip
              label="Byproduct"
              sx={{
                backgroundColor: theme.palette.warning.main, // Use warning color for chip background
                color: theme.palette.warning.contrastText, // Use contrast text color
              }}
            />
          )}
        </Box>

        {/* Producer Details */}
        <Typography
          variant="subtitle1"
          sx={{ mt: 2, mb: 1, color: theme.palette.text.secondary }}
        >
          Producer: {producerType}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          Count: {producerCount}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductionNode;
