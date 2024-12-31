import React from "react";

interface Task {
  ID: number;
  Content: string;
  DateCheck: Date | null;
  Deadline: string;
  Priority: number;
  State: string;
  Title: string;
  UserID: number;
  done: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onMarkAsDone: (index: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onMarkAsDone }) => {
  return (
    <div className="task-list">
      <h1 className="m-0">Top Tasks</h1>
      {tasks.map((task, index) => (
        <div key={task.ID} className={`task-card ${task.done ? "done" : ""}`}>
          <h4>{task.Title}</h4>
          <p>Due date: {task.Deadline}</p>
          <span className="priority">
            Priority: {task.Priority === 1 ? "High" : task.Priority === 2 ? "Medium" : "Low"}
          </span>
          <div className="task-actions">
            <button onClick={() => onMarkAsDone(index)}>
              {task.done ? "Undo" : "Mark as Done"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;