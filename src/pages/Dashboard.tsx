import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import TaskList from "../components/TaskList";
import Calendar from "../components/Calendar";
import ProgressIndicator from "../components/ProgressIndicator";
import ProgressChart from "../components/ProgressChart";

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState([
    { title: "Finish report", dueDate: "2024-12-30", priority: 1, done: false },
    { title: "Prepare slides", dueDate: "2024-12-31", priority: 2, done: false },
    { title: "Team meeting", dueDate: "2024-12-29", priority: 3, done: true },
    { title: "Urgent task", dueDate: "2024-12-28", priority: 1, done: true },
    { title: "Important task", dueDate: "2024-12-27", priority: 1, done: true },
    { title: "Important task", dueDate: "2025-01-12", priority: 1, done: false },
    { title: "Important task", dueDate: "2025-01-02", priority: 1, done: false },
  ]);

  const [topTasks, setTopTasks] = useState<typeof tasks>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleMarkAsDone = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].done = !updatedTasks[index].done; // Toggle done status
    setTasks(updatedTasks);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the start of the day

    // Filter tasks with priority 1 and sort by the closest due date
    let filteredTasks = tasks
      .filter((task) => task.priority === 1 && new Date(task.dueDate) >= today)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3); // Take the top 3

    // If there are less than 3 tasks, add more tasks regardless of priority
    if (filteredTasks.length < 3) {
      const additionalTasks = tasks
        .filter((task) => new Date(task.dueDate) >= today && !filteredTasks.includes(task))
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      filteredTasks = filteredTasks.concat(additionalTasks).slice(0, 3);
    }

    setTopTasks(filteredTasks);
  }, [tasks]);

  // Calendar marked with days that have tasks
  const markedDays = tasks
    .filter((task) => new Date(task.dueDate) >= new Date())
    .map((task) => {
      const date = new Date(task.dueDate);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    });

  // Progress data for the week calculated through productivity of the day
  const progressData = [
    { day: "Mon", progress: 50 },
    { day: "Tue", progress: 60 },
    { day: "Wed", progress: 70 },
    { day: "Thu", progress: 80 },
    { day: "Fri", progress: 90 },
    { day: "Sat", progress: 80 },
    { day: "Sun", progress: 20 },
  ];

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <TopBar />
        <div className="container my-3">
          <div className="row">
            <div className="col-md-6">
              <TaskList tasks={topTasks} onMarkAsDone={handleMarkAsDone} />
            </div>
            <div className="col-md-6">
              <ProgressIndicator progress={75} />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-6">
              <Calendar
                markedDays={markedDays}
                currentMonth={currentMonth}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />
            </div>
            <div className="col-md-6">
              <ProgressChart data={progressData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;