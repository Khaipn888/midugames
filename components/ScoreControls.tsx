'use client';

import React, { useState } from 'react';

interface ScoreControlsProps {
  score: number;
  targetScore: number;
  setTargetScore: (score: number) => void;
  onUpdateScore: (newScore: number, actionType: 'correct' | 'wrong') => void;
  isDisabled: boolean;
}

const ScoreControls: React.FC<ScoreControlsProps> = ({ score, targetScore, setTargetScore, onUpdateScore, isDisabled }) => {

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setTargetScore(isNaN(value) || value < 1 ? 1 : value);
  };
  
  const isGoalReached = score >= targetScore;

  return (
    <div className="flex flex-col items-center w-full bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in-up">
      
      {/* Input Target Score (Chỉ bật khi chưa bắt đầu) */}
      <div className="mb-6 w-full max-w-xs">
          <label className="text-sm font-medium text-gray-500 block mb-1">
              Đáp án cần đạt (Tối thiểu 1)
          </label>
          <input
              type="number"
              min="1"
              value={targetScore}
              onChange={handleTargetChange}
              disabled={!isDisabled} // Bật khi isDisabled là FALSE (chưa chạy)
              className={`w-full text-center p-2 border-2 rounded-lg text-2xl font-bold 
                          ${!isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'border-m-fuchsia focus:border-m-purple'}`}
          />
      </div>

      {/* Bộ điều khiển điểm */}
      <div className="flex items-center justify-center space-x-6">
          <button
            onClick={() => onUpdateScore(score - 1, 'wrong')}
            disabled={isDisabled}
            className={`p-3 text-white rounded-full transition duration-150 transform shadow-md active:scale-95 
                        ${isDisabled ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600 hover:scale-110'}`}
            aria-label="Giảm Đáp Án Đúng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-gray-500">ĐÁP ÁN ĐÚNG HIỆN TẠI</span>
            <span className={`text-6xl font-black text-m-purple transition-colors duration-300 ${isGoalReached ? 'text-green-500 animate-bounce' : ''}`}>{score}</span>
          </div>

          <button
            onClick={() => onUpdateScore(score + 1, 'correct')}
            disabled={isDisabled}
            className={`p-3 text-white rounded-full transition duration-150 transform shadow-md active:scale-95 
                        ${isDisabled ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600 hover:scale-110'}`}
            aria-label="Tăng Đáp Án Đúng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
      </div>
    </div>
  );
};

export default ScoreControls;