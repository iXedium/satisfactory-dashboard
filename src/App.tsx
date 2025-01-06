import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import AdminLayout from './layouts/AdminLayout';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures consistent styling */}
      <AdminLayout>
        <div>Welcome to the Satisfactory Dashboard!</div>
      </AdminLayout>
    </ThemeProvider>
  );
};

export default App;
