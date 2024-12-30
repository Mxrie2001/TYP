// src/App.tsx
import React from "react";
import Dashboard from "./pages/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

const App: React.FC = () => {
  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default App;
