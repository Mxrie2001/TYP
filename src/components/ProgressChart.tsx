import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ProgressChartProps {
  data: { day: string; completedTasks: number }[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  return (
    <div className="progress-chart">
      <h4>Progress Over the Week</h4>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="completedTasks" stroke="#007bff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;