"use client";
import React, { useState, useEffect } from 'react';

/**
 * @typedef {Object} Timer
 * @property {string} id - The unique identifier for the timer. Generated using Date.now()
 * @property {number} duration - The duration of the timer in milliseconds.
 * @property {number} timeLeft - The remaining time of the timer in milliseconds.
 * @property {number} endAt - The end time of the timer in milliseconds.
 * @property {boolean} isRunning - Indicates if the timer is currently running.
 */

function App() {
  const [time, setTime] = useState({ hrs: '00', mins: '01', secs: '00' });
  const [timers, setTimers] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTime((prevTime) => ({
      ...prevTime,
      [name]: value,
    }));
  };

  const addTimer = (ms) => {
    const newTimer = {
      id: Date.now().toString(),
      duration: ms,
      timeLeft: ms,
      endAt: Date.now() + ms,
      isRunning: true,
    };
    setTimers((prevTimers) => [...prevTimers, newTimer]);
  };

  const handleAddTimer = () => {
    const ms =
      parseInt(time.hrs, 10) * 3600000 +
      parseInt(time.mins, 10) * 60000 +
      parseInt(time.secs, 10) * 1000;

    if (ms < 10000) {
      alert('Timer must be at least 10 seconds');
      return;
    }

    addTimer(ms);
  };

  return (
    <main className="mx-auto flex min-h-full max-w-3xl flex-col gap-8 p-4">
      <h1 className="text-center text-3xl font-bold mb-4">Timer</h1>
      <div className="flex flex-col gap-4 items-center">
      <div className="flex items-center justify-center gap-8 rounded-md bg-base-200 p-4 text-lg font-bold text-base-content">
      <div className="flex flex-col items-center">
            <p className="text-neutral-content">hr</p>
            <input
              className="h-12 w-20 rounded-md bg-base-200 text-center text-4xl focus:bg-accent focus:text-accent-content focus:outline-none"
              name="hrs"
              value={time.hrs}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col items-center mt-4">
            <p className="text-neutral-content">min</p>
            <input
              className="h-12 w-20 rounded-md bg-base-200 text-center text-4xl focus:bg-accent focus:text-accent-content focus:outline-none"
              name="mins"
              value={time.mins}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col items-center mt-4">
            <p className="text-neutral-content">sec</p>
            <input
              className="h-12 w-20 rounded-md bg-base-200 text-center text-4xl focus:bg-accent focus:text-accent-content focus:outline-none"
              name="secs"
              value={time.secs}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button className="btn btn-success mt-4" onClick={handleAddTimer}>
          Add Timer
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
        {timers.map((timer) => (
          <TimerComponent key={timer.id} timer={timer} />
        ))}
      </div>
    </main>
  );
}

const TimerComponent = ({ timer }) => {
  const [timeLeft, setTimeLeft] = useState(timer.timeLeft);
  const [isRunning, setIsRunning] = useState(timer.isRunning);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const newTimeLeft = timer.endAt - Date.now();
      if (newTimeLeft <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        setIsRunning(false);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timer.endAt]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handlePauseResume = () => {
    setIsRunning(!isRunning);
  };

  const handleDelete = () => {
    // Implement deletion logic here
  };

  const radius = 89.1; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const strokeDashoffset = circumference * (1 - timeLeft / timer.duration);

  return (
    <div className="relative flex size-[224px] flex-col gap-2 rounded-2xl bg-base-200 p-4">
      <div className="relative flex items-center justify-center">
        <svg width="198" height="198" className="absolute" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            className="text-neutral-content"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            r={radius}
            cx="99"
            cy="99"
          />
          <circle
            className="text-primary"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            r={radius}
            cx="99"
            cy="99"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="flex flex-col items-center justify-center">
          <p className="text-base-content text-5xl">{formatTime(timeLeft)}</p>
          <p className="text-sm text-neutral-content">{Math.floor(timer.duration / 60000)} mins</p>
        </div>
      </div>
      <button className="absolute bottom-3 left-3 flex size-7 items-center justify-center rounded-full bg-base-300 p-0 text-base-content" onClick={handleDelete}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
      <button className="absolute bottom-3 right-3 flex size-7 items-center justify-center rounded-full p-0 bg-warning text-warning-content" onClick={handlePauseResume}>
        {isRunning ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pause">
            <path d="M10 19H6V5h4zM18 5v14h-4V5z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play">
            <path d="M5 3v18l15-9L5 3z"></path>
          </svg>
        )}
      </button>
    </div>
  );
}

export default App;
