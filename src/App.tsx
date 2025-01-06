import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme/theme';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import CompareStates from './pages/CompareStates';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AdminLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/compare" element={<CompareStates />} />
          </Routes>
        </AdminLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
