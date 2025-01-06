import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h6">Production Chain</Typography>
          <Typography>Placeholder for production chain data</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h6">Statistics</Typography>
          <Typography>Placeholder for stats</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
