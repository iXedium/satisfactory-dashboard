import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2"; // Use Grid2
import {
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { getBuilds, Build } from "../db";

const CompareStates: React.FC = () => {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [selectedBuild1, setSelectedBuild1] = useState<number | "">("");
  const [selectedBuild2, setSelectedBuild2] = useState<number | "">("");

  useEffect(() => {
    const fetchBuilds = async () => {
      const data = await getBuilds();
      setBuilds(data);
    };

    fetchBuilds();
  }, []);

  const handleSelectBuild1 = (event: SelectChangeEvent<number | "">) => {
    setSelectedBuild1(
      event.target.value === "" ? "" : Number(event.target.value)
    );
  };

  const handleSelectBuild2 = (event: SelectChangeEvent<number | "">) => {
    setSelectedBuild2(
      event.target.value === "" ? "" : Number(event.target.value)
    );
  };

  const getBuildDetails = (id: number | "") =>
    builds.find((build) => build.id === id) || {
      name: "No Build Selected",
      productionChains: [],
    };

  const build1 = getBuildDetails(selectedBuild1);
  const build2 = getBuildDetails(selectedBuild2);

  return (
    <Grid container spacing={3}>
      <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
        <FormControl fullWidth>
          <InputLabel>Select Build 1</InputLabel>
          <Select value={selectedBuild1} onChange={handleSelectBuild1}>
            <MenuItem value="">None</MenuItem>
            {builds.map((build) => (
              <MenuItem key={build.id} value={build.id}>
                {build.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
          <Typography variant="h6">{build1.name}</Typography>
          <Typography>
            Chains:
            {build1.productionChains.map((chain) => (
              <div key={chain.id}>
                {chain.name} - {chain.rate} items/min
              </div>
            ))}
          </Typography>
        </Paper>
      </Grid>
      <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
        <FormControl fullWidth>
          <InputLabel>Select Build 2</InputLabel>
          <Select value={selectedBuild2} onChange={handleSelectBuild2}>
            <MenuItem value="">None</MenuItem>
            {builds.map((build) => (
              <MenuItem key={build.id} value={build.id}>
                {build.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
          <Typography variant="h6">{build2.name}</Typography>
          <Typography>
            Chains:
            {build2.productionChains.map((chain) => (
              <div key={chain.id}>
                {chain.name} - {chain.rate} items/min
              </div>
            ))}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CompareStates;
