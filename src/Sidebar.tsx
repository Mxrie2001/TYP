// src/components/Sidebar.tsx
import React from "react";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar d-flex flex-column align-items-start p-3">
        <i className="bi bi-list-task me-2" style={{ fontSize: "1.5rem" }}></i>
        <h2 className="fs-5">TYP</h2>      
        <ul className="list-unstyled">
        <li><a href="#" className="text-white">All Tasks</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
