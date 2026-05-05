import React, { useEffect, useState } from "react";
import "./FlipTimer.css";
import DailyContributions from "./DailyContributions";
import AIChat from "./AIChat";
      

const BLOCK_TIME = 30 * 60;
const TOTAL_BLOCKS = 14;
const TOTAL_TIME = BLOCK_TIME * TOTAL_BLOCKS;

// ✅ IST date
const getISTDate = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

const FlipTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [blocks, setBlocks] = useState(0);
  const [showDailyContributions, setShowDailyContributions] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("studyHistory"));
    return Array.isArray(saved) ? saved : [];
  });

  // ✅ TODAY
  const [todaySeconds, setTodaySeconds] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("studyToday"));
    const today = getISTDate();

    if (saved && saved.date === today) {
      return saved.seconds;
    }
    return 0;
  });

  // ✅ TOTAL
  const [totalSeconds, setTotalSeconds] = useState(() => {
    return Number(localStorage.getItem("studyTotal")) || 0;
  });

  const [dailyContributions, setDailyContributions] = useState(0);

  // TIMER
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        const newTime = prev + 1;

        if (newTime % BLOCK_TIME === 0 && blocks < TOTAL_BLOCKS) {
          setBlocks((b) => b + 1);
        }

        return newTime;
      });

      setTodaySeconds((prev) => prev + 1);
      setTotalSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, blocks]);

  // SAVE TODAY
  useEffect(() => {
    localStorage.setItem(
      "studyToday",
      JSON.stringify({
        date: getISTDate(),
        seconds: todaySeconds,
      })
    );
  }, [todaySeconds]);

  // SAVE TOTAL
  useEffect(() => {
    localStorage.setItem("studyTotal", totalSeconds);
  }, [totalSeconds]);

  // SAVE HISTORY
  useEffect(() => {
    const today = getISTDate();
    const historyEntry = { date: today, seconds: todaySeconds };
    
    setHistory((prev) => {
      const updated = prev.filter((item) => item.date !== today);
      return [historyEntry, ...updated];
    });

    localStorage.setItem("studyHistory", JSON.stringify([
      historyEntry,
      ...history.filter((item) => item.date !== today),
    ]));
  }, [todaySeconds]);

  const formatTime = (t) => {
    const h = String(Math.floor(t / 3600)).padStart(2, "0");
    const m = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
    const s = String(t % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatDaily = (t) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const progress = Math.min((time / TOTAL_TIME) * 100, 100);
  const dailyProgress = Math.min((todaySeconds / TOTAL_TIME) * 100, 100);

  const toggleRunning = () => {
    setIsRunning((prev) => !prev);
  };

  const content = showDailyContributions ? (
 
  // <DailyContributions dailyContributions={dailyContributions} setDailyContributions={setDailyContributions} history={history} />
  <DailyContributions 
  dailyContributions={dailyContributions} 
  setDailyContributions={setDailyContributions} 
  history={history}
  todaySeconds={todaySeconds}   // ✅ ADD THIS
/>
  ) : (
    <>
      <div className="timer" onClick={toggleRunning}>
        {formatTime(time)}
      </div>

      <div className="total-timer">
        <div>Total: {formatDaily(totalSeconds)}</div>
        <div>Today-Total : {formatDaily(todaySeconds)}</div>
      </div>
      <AIChat />

      {/* TRACK */}
      <div className="track">
        <div className="line">
          <div className="fill" style={{ width: `${progress}%` }} />

          <div className="student" style={{ left: `${progress}%` }}>
            <div className="student-label">30m</div>

            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="5" r="3" />
              <path d="M10 9h4v10h-4z" />
              <path d="M8 12h8l2 8h-3l-1-5h-4l-1 5H6z" />
            </svg>
          </div>
        </div>

        <div className="blocks">
          {[...Array(TOTAL_BLOCKS)].map((_, i) => (
            <div
              key={i}
              className={`block ${i < blocks ? "active" : ""}`}
            />
          ))}
        </div>

        <div className="blocks-info">
          Each block = 30 minutes
        </div>
      </div>

      {/* CONTROLS */}
      <div className="controls">
        <button onClick={() => setIsRunning(true)}>Start</button>
        <button onClick={() => setIsRunning(false)}>Stop</button>
        <button
          onClick={() => {
            setTime(0);
            setBlocks(0);
            setIsRunning(false);
          }}
        >
          Reset
        </button>
      </div>
    </>
  );
  return (
    <div className="wrapper" style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 1 }}>
        <button onClick={() => setShowDailyContributions((prev) => !prev)}>
          {showDailyContributions ? "Hide " : "Monthly Record"}
        </button>
      </div>

      {content}
    </div>
  );
};

export default FlipTimer;