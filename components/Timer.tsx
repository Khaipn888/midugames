'use client';

import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialTime: number;
  onTimeUp: () => void;
  // onTick chỉ báo hiệu 1 lần khi bắt đầu hoặc mỗi mốc quan trọng
  onTick: () => void; 
  isRunning: boolean; // Thêm prop để kiểm soát việc đếm ngược
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, onTick, isRunning }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    setTime(initialTime); 
  }, [initialTime]);

  useEffect(() => {
    if (!isRunning) return; // Dừng nếu chưa bấm Bắt đầu

    if (time <= 0) {
      onTimeUp();
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

  const percentage = (time / initialTime) * 100;
  const isDanger = time <= 5; 

  return (
    <div className="w-full max-w-sm mx-auto my-4">
      <div className="flex justify-between items-center mb-1">
        <span className={`text-4xl font-extrabold transition-colors duration-300 ${isDanger ? 'text-red-600 animate-pulse' : 'text-m-purple'}`}>
          {time}s
        </span>
        <span className="text-sm text-gray-500">Thời gian còn lại</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ${isDanger ? 'bg-red-500 animate-flash' : 'bg-m-fuchsia'}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;