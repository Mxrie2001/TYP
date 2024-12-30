import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import TaskList from "../components/TaskList";
import Calendar from "../components/Calendar";
import ProgressIndicator from "../components/ProgressIndicator";
import ProgressChart from "../components/ProgressChart";

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<{ title: string; dueDate: string; priority: number; done: boolean; completedDate: Date | null }[]>([
    { title: "Finish report", dueDate: "2024-12-30", priority: 1, done: false, completedDate: null },
    { title: "Prepare slides", dueDate: "2024-12-31", priority: 2, done: false, completedDate: null },
    { title: "Team meeting", dueDate: "2024-12-29", priority: 3, done: false, completedDate: null },
    { title: "Urgent task", dueDate: "2024-12-28", priority: 1, done: false, completedDate: null },
    { title: "Important task", dueDate: "2024-12-27", priority: 1, done: false, completedDate: null },
    { title: "Important task", dueDate: "2025-01-12", priority: 1, done: false, completedDate: null },
    { title: "Important task", dueDate: "2025-01-02", priority: 1, done: false, completedDate: null },
  ]);

  const [topTasks, setTopTasks] = useState<typeof tasks>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());


  const handleMarkAsDone = (index: number) => {
    const taskIndex = tasks.findIndex(task => task.title === topTasks[index].title && task.dueDate === topTasks[index].dueDate);
    if (taskIndex !== -1) {
      const updatedTasks = [...tasks];
      const task = updatedTasks[taskIndex];
      task.done = !task.done; // Toggle done status
      task.completedDate = task.done ? new Date() : null; // Set or clear completed date
      setTasks(updatedTasks);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

// Calculate progress based on completed tasks
const calculateProgress = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the start of the day
  const validTasks = tasks.filter(task => new Date(task.dueDate) >= today);
  const totalTasks = validTasks.length;
  const completedTasks = validTasks.filter(task => task.done).length;
  const progress = (completedTasks / totalTasks) * 100;
  return parseFloat(progress.toFixed(2));
};

// Calculate top tasks based on priority and due date
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

  // Calendar marked with days that have tasks starting from today
  const markedDays = tasks
    .filter((task) => {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the start of the day
      return taskDate >= today;
    })
    .map((task) => {
      const date = new Date(task.dueDate);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    });


  // Calculate progress data for the week
  const calculateWeeklyProgress = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const progressData = weekDays.map((day, index) => {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - dayStart.getDay() + index);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayTasks = tasks.filter(task => {
        if (!task.completedDate) return false;
        const taskDate = new Date(task.completedDate);
        return taskDate >= dayStart && taskDate <= dayEnd;
      });

      const completedTasks = dayTasks.length;

      return { day, completedTasks };
    });

    return progressData;
  };

  const progressData = calculateWeeklyProgress();

  console.log("Progress Data:", progressData); // Log progress data for debugging

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
              <ProgressIndicator progress={calculateProgress()} />
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