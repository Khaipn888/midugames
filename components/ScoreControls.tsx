"use client";

import React, { useEffect } from "react";

interface ScoreControlsProps {
  score: number;
  targetScore: number;
  setTargetScore: (score: number) => void;
  onUpdateScore: (newScore: number, actionType: "correct" | "wrong") => void;
  isDisabled: boolean;
}

const ScoreControls: React.FC<ScoreControlsProps> = ({
  score,
  targetScore,
  setTargetScore,
  onUpdateScore,
  isDisabled,
}) => {
  // Lắng nghe sự kiện nhấn phím để cập nhật điểm
  useEffect(() => {
    // Chỉ lắng nghe khi đang trong màn hình chơi game (isDisabled = true)
    if (!isDisabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        onUpdateScore(score + 1, "correct");
      } else if (event.key === "ArrowDown") {
        // Đảm bảo điểm không bị âm
        if (score > 0) {
          onUpdateScore(score - 1, "wrong");
        }
      } else if (event.key === "ArrowLeft") {
        onUpdateScore(score, "wrong");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDisabled, score, onUpdateScore]); // Dependencies

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setTargetScore(isNaN(value) || value < 1 ? 1 : value);
  };

  const isGoalReached = score >= targetScore;

  return (
    <div className="flex flex-col items-center w-full bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in-up">
      {/* Input Target Score (Chỉ bật khi chưa bắt đầu) */}
      {!isDisabled && (
        <div className="mb-6 w-full max-w-xs flex flex-col items-center justify-between gap-3 text-m-purple text-xl font-bold">
          <div>Số đáp án cam kết</div>
          <input
            type="number"
            min={0}
            value={targetScore}
            onChange={handleTargetChange}
            disabled={isDisabled} // Bật khi isDisabled là FALSE (chưa chạy)
            className={`w-full text-center p-2 border rounded-lg text-3xl font-bold text-m-purple
                          ${
                            isDisabled
                              ? "bg-gray-100 cursor-not-allowed"
                              : "border-m-fuchsia focus:border-m-purple"
                          }`}
          />
        </div>
      )}

      {/* Bộ điều khiển điểm */}
      {isDisabled && (
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm font-medium text-gray-500">ĐÁP ÁN ĐÚNG</span>
          <span
            className={`text-6xl font-black text-m-purple transition-colors duration-300 ${
              isGoalReached ? "text-green-500 animate-bounce" : ""
            }`}
          >
            {`${score}/${targetScore}`}
          </span>
          <span className="mt-2 text-xs text-gray-400"></span>
        </div>
      )}
    </div>
  );
};

export default ScoreControls;
