import React from "react";

interface Task {
  title: string;
  dueDate: string;
  priority: number;
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
        <div key={index} className={`task-card ${task.done ? "done" : ""}`}>
          <h4>{task.title}</h4>
          <p>Due date: {task.dueDate}</p>
          <span className="priority">
            Priority: {task.priority === 1 ? "High" : task.priority === 2 ? "Medium" : "Low"}
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