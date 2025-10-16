"use client";

import React, { useState, useEffect } from "react";

interface TimerProps {
  initialTime: number;
  onTimeUp: () => void;
  // onTick chỉ báo hiệu 1 lần khi bắt đầu hoặc mỗi mốc quan trọng
  onTick: () => void;
  isRunning: boolean; // Thêm prop để kiểm soát việc đếm ngược
  resetKey?: any; // Thêm prop để reset timer từ bên ngoài
}

const Timer: React.FC<TimerProps> = ({
  initialTime,
  onTimeUp,
  onTick,
  isRunning,
  resetKey,
}) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime, resetKey]);

  useEffect(() => {
    if (!isRunning) return; // Dừng nếu chưa bấm Bắt đầu

    if (time <= 0) {
      setTimeout(() => {
        onTimeUp();
      }, 1000);
      return;
    }

    // Phát âm thanh Tick một lần khi bắt đầu đếm ngược
    if (time === initialTime) {
      onTick();
    }

    const timer = setInterval(() => {
      setTime((prevTime) => {
        const newTime = prevTime - 1;

        // Tùy chọn: Phát âm thanh tick khi còn 5 giây cuối
        if (newTime > 0 && newTime <= 5) {
          onTick();
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [time, onTimeUp, onTick, initialTime, isRunning]);

  const isDanger = time <= 5 && time > 0;

  // --- SVG Circle Timer Logic ---
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (time / initialTime) * circumference;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 160 160"
      >
        {/* Background Circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#e5e7eb" // gray-200
          strokeWidth="12"
          fill="transparent"
        />
        {/* Progress Circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke={isDanger ? "#ef4444" : "#E879F9"} // red-500 or m-fuchsia
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
          className={`transition-all duration-1000 ease-linear ${
            isDanger ? "animate-pulse" : ""
          }`}
        />
      </svg>
      <span
        className={`text-5xl font-black transition-colors duration-300 ${
          isDanger ? "text-red-500 animate-pulse" : "text-m-purple"
        }`}
      >
        {time}
      </span>
    </div>
  );
};

export default Timer;
