// src/components/ProgressIndicator.tsx
import React from "react";
import { ProgressBar } from "react-bootstrap";

interface ProgressIndicatorProps {
  progress: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress }) => {
  return (
    <div className="progress-indicator">
      <h4>Progress Bar</h4>
      <ProgressBar now={progress} label={`${progress}%`} />
    </div>
  );
};

export default ProgressIndicator;
