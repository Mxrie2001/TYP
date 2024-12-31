import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TaskList from "../components/TaskList";
import Calendar from "../components/Calendar";
import ProgressIndicator from "../components/ProgressIndicator";
import ProgressChart from "../components/ProgressChart";
import { fetchItemsFromDynamoDBByUserID } from "../components/DynamoDB";
import { useUser } from '../components/UserContext';

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

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [topTasks, setTopTasks] = useState<Task[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      try {
        const items = await fetchItemsFromDynamoDBByUserID('Todo', user.ID);
        const formattedItems = items.map((item: any) => ({
          ID: item.ID,
          Content: item.Content,
          DateCheck: item.DateCheck ? new Date(item.DateCheck) : null,
          Deadline: item.Deadline,
          Priority: item.Priority,
          State: item.State,
          Title: item.Title,
          UserID: item.UserID,
          done: item.State === "done", // Set the done property based on the State
        }));
        setTasks(formattedItems);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [user]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the start of the day

    // Filter tasks with priority 1 and sort by the closest due date
    let filteredTasks = tasks
      .filter((task) => task.Priority === 1 && new Date(task.Deadline) >= today)
      .sort((a, b) => new Date(a.Deadline).getTime() - new Date(b.Deadline).getTime())
      .slice(0, 3); // Take the top 3

    // If there are less than 3 tasks, add more tasks regardless of priority
    if (filteredTasks.length < 3) {
      const additionalTasks = tasks
        .filter((task) => new Date(task.Deadline) >= today && !filteredTasks.includes(task))
        .sort((a, b) => new Date(a.Deadline).getTime() - new Date(b.Deadline).getTime());
      filteredTasks = filteredTasks.concat(additionalTasks).slice(0, 3);
    }

    setTopTasks(filteredTasks);
  }, [tasks]);

  const handleMarkAsDone = (index: number) => {
    const taskIndex = tasks.findIndex(task => task.ID === topTasks[index].ID);
    if (taskIndex !== -1) {
      const updatedTasks = [...tasks];
      const task = updatedTasks[taskIndex];
      task.done = !task.done; // Toggle done status
      task.DateCheck = task.done ? new Date() : null; // Set or clear DateCheck
      task.State = task.done ? "done" : "pending"; // Update the State
      setTasks(updatedTasks);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const calculateProgress = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the start of the day
    const validTasks = tasks.filter(task => new Date(task.Deadline) >= today);
    const totalTasks = validTasks.length;
    const completedTasks = validTasks.filter(task => task.done).length;
    const progress = (completedTasks / totalTasks) * 100;
    return parseFloat(progress.toFixed(2));
  };

  // Calendar marked with days that have tasks starting from today
  const markedDays = tasks
    .filter((task) => {
      const taskDate = new Date(task.Deadline);
      taskDate.setHours(0, 0, 0, 0); // Set time to the start of the day
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the start of the day
      return taskDate >= today;
    })
    .map((task) => {
      const date = new Date(task.Deadline);
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
        if (!task.DateCheck) return false;
        const taskDate = new Date(task.DateCheck);
        return taskDate >= dayStart && taskDate <= dayEnd;
      });

      const completedTasks = dayTasks.length;

      return { day, completedTasks };
    });

    return progressData;
  };

  const progressData = calculateWeeklyProgress();

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <div className="container my-3">
          <div className="row">
            <div className="col-md-6">
              <TaskList tasks={topTasks} onMarkAsDone={handleMarkAsDone} />
            </div>
            <div className="col-md-6">
              <ProgressIndicator progress={calculateProgress()} />
              <ProgressChart data={progressData} />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;