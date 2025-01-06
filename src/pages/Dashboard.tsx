import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2"; // Use Grid2
import {
  Paper,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { addBuild, getBuilds, Build } from "../db";

const Dashboard: React.FC = () => {
  const [builds, setBuilds] = useState<Build[]>([]);

  useEffect(() => {
    const fetchBuilds = async () => {
      const data = await getBuilds();
      setBuilds(data);
    };

    fetchBuilds();
  }, []);

  const handleAddBuild = async () => {
    await addBuild(`Build ${builds.length + 1}`, []);
    const updatedBuilds = await getBuilds();
    setBuilds(updatedBuilds);
  };

  return (
    <Grid container spacing={3}>
      <Grid sx={{ gridColumn: { xs: "span 12" } }}>
        <Button variant="contained" onClick={handleAddBuild}>
          Add New Build
        </Button>
      </Grid>
      {builds.map((build) => (
        <Grid
          key={build.id}
          sx={{
            gridColumn: { xs: "span 12", sm: "span 6", md: "span 4" },
          }}
        >
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">{build.name}</Typography>
            <Typography>
              Production Chains: {build.productionChains.length}
            </Typography>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {build.productionChains.map((chain) => (
                  <div key={chain.id}>
                    {chain.name} - {chain.rate} items/min
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Dashboard;
