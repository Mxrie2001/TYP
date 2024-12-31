import React from "react";

interface CalendarProps {
  markedDays: string[];
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ markedDays, currentMonth, onPrevMonth, onNextMonth }) => {
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Create an array of days in the month
  const daysArray = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  // Fill the remaining days with null
  const remainingDays = 7 - (daysArray.length % 7);
  if (remainingDays !== 7) {
    daysArray.push(...Array(remainingDays).fill(null));
  }

  // Split days into weeks
  const weeks = [];
  while (daysArray.length) {
    weeks.push(daysArray.splice(0, 7));
  }

  // Check if a day is marked
  const isMarked = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    console.log(`Checking if ${dateStr} is marked: ${markedDays.includes(dateStr)}`);
    return markedDays.includes(dateStr);
  };

  // Check if a day is today to color it if there's a task due
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="calendar">
      <div className="month-name text-center mb-2">
        <button onClick={onPrevMonth}> ← Prev </button>
        <h4 className="mb-0">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h4>
        <button onClick={onNextMonth}> Next → </button>
      </div>
      <div className="week-days d-flex justify-content-between mb-2">
        {weekDays.map((day, index) => (
          <div key={index} className="week-day text-center">
            {day}
          </div>
        ))}
      </div>
      <div className="d-flex flex-wrap">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="d-flex justify-content-between w-100">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`calendar-day border p-2 m-1 text-center ${day ? (isMarked(day) ? "bg-primary text-light" : "") : "empty"} ${day && isToday(day) ? "today" : ""}`}
                >
                {day}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;