import { RichTreeView, TreeItem2 } from "@mui/x-tree-view";
import { Box, Typography } from "@mui/material";

const ProductionPlanner = () => {
  const treeItems = [
    {
      id: "1",
      label: "Iron Production",
      children: [
        {
          id: "2",
          label: "Iron Ingot",
        },
      ],
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Production Planner
      </Typography>

      <RichTreeView
        aria-label="production chain tree"
        defaultExpandedItems={["1"]}
        items={treeItems}
        sx={{
          height: 400,
          maxWidth: 400,
          overflowY: "auto",
          flexGrow: 1,
        }}
      >
        <TreeItem2 itemId="1" label="Iron Production">
          <TreeItem2 itemId="2" label="Iron Ingot" />
        </TreeItem2>
      </RichTreeView>
    </Box>
  );
};

export default ProductionPlanner;
