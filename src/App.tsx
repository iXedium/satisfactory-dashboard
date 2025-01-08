import React from "react";
import { ThemeContextProvider } from "./context/ThemeContext";
import { ProductionProvider } from "./context/ProductionContext";
import AdminLayout from "./layouts/AdminLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CompareStates from "./pages/CompareStates";
import ProductionPlanner from "./pages/ProductionPlanner";
import "./db/populateDatabase";

const App: React.FC = () => {
  return (
    <ThemeContextProvider>
      <ProductionProvider>
        <Router>
          <AdminLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/compare" element={<CompareStates />} />
              <Route path="/planner" element={<ProductionPlanner />} />
            </Routes>
          </AdminLayout>
        </Router>
      </ProductionProvider>
    </ThemeContextProvider>
  );
};

export default App;
