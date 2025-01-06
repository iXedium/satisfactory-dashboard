import React from "react";
import { ThemeContextProvider } from "./context/ThemeContext";
import AdminLayout from "./layouts/AdminLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CompareStates from "./pages/CompareStates";

const App: React.FC = () => {
  return (
    <ThemeContextProvider>
      <Router>
        <AdminLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/compare" element={<CompareStates />} />
          </Routes>
        </AdminLayout>
      </Router>
    </ThemeContextProvider>
  );
};

export default App;
