// src/components/TopBar.tsx
import React from "react";

const TopBar: React.FC = () => {
  return (
    <div className="d-flex justify-content-between align-items-center bg-primary text-white p-3">
      <h1 className="m-0">Dashboard</h1>
      <div className="d-flex gap-3">
        <li><a href="#" className="text-white">Users</a></li>

      </div>
    </div>
  );
};

export default TopBar;
