import React, { useEffect, useState } from "react";
import "./Dailycontrubtions.css";

const formatTime = (minutes) => {
  const mins = Number(minutes) || 0;
  const hours = Math.floor(mins / 60);
  const remainder = mins % 60;
  return `${hours}h ${remainder}m`;
};

const DailyContributions = ({
  dailyContributions,
  setDailyContributions,
  todaySeconds
}) => {

  const [dailyData, setDailyData] = useState(() => {
    return JSON.parse(localStorage.getItem("dailyUserTracking")) || {};
  });

  // ✅ Sync timer → minutes
  useEffect(() => {
    if (todaySeconds !== undefined) {
      setDailyContributions(Math.floor(todaySeconds / 60));
    }
  }, [todaySeconds]);

  // ✅ Save data (day + date)
  useEffect(() => {
    if (todaySeconds === undefined) return;

    const today = new Date();
    const day = today.toLocaleDateString("en-US", { weekday: "long" });
    const date = today.toLocaleDateString("en-CA");

    const key = `${day}-${date}`;
    const minutes = Math.floor(todaySeconds / 60);

    setDailyData((prev) => {
      const updated = { ...prev, [key]: minutes };
      localStorage.setItem("dailyUserTracking", JSON.stringify(updated));
      return updated;
    });

  }, [todaySeconds]);

  // ✅ Generate calendar
  const generateCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];

    // empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = dateObj.toLocaleDateString("en-CA");

      const dayName = dateObj.toLocaleDateString("en-US", {
        weekday: "long"
      });

      const key = `${dayName}-${dateStr}`;
      const minutes = dailyData[key] || 0;

      days.push({
        day: d,
        minutes
      });
    }

    return days;
  };

  const calendarDays = generateCalendar();

  // ✅ total
  const totalMinutes = Object.values(dailyData).reduce(
    (sum, m) => sum + m,
    0
  );

  return (
    <div className="daily-time">

      {/* HEADER */}
      <div className="contribution-header">
        <h2>⏱️ Daily Time Tracker</h2>

        <div className="time-display">
          <div className="time-value">
            {formatTime(Math.floor(todaySeconds / 60))}
          </div>
          <p className="time-label">Today</p>
        </div>
      </div>

      {/* TOTAL */}
      <div className="total-timer">
        <div>Total: {formatTime(totalMinutes)}</div>
      </div>

      {/* CALENDAR */}
      <div className="daily-history">
        <h3>📅 Calendar View</h3>

        <div className="calendar-grid">

          {/* WEEK HEADERS */}
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="calendar-header">{d}</div>
          ))}

          {/* DAYS */}
          {calendarDays.map((item, index) => (
            <div key={index} className="calendar-cell">
              {item ? (
                <>
                  <div className="calendar-date">{item.day}</div>

                  {item.minutes > 0 && (
                    <div className="calendar-time">
                      {formatTime(item.minutes)}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          ))}

        </div>
      </div>

    </div>
  );
};

export default DailyContributions;