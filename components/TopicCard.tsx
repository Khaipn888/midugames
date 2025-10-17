// File: src/components/TopicCard.tsx
'use client'; // <-- Bắt buộc phải là Client Component

import React from 'react';
import { Topic } from '@/types'; // Sử dụng alias @/types

interface TopicCardProps {
  topic: Topic;
  onSelect: (topic: Topic) => void;
  isDisabled: boolean;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onSelect, isDisabled }) => {
  // ... (Nội dung component TopicCard giữ nguyên)
  const { name, icon, color } = topic;

  return (
    <div
      onClick={() => !isDisabled && onSelect(topic)}
      className={`
        ${color} 
        text-white p-8 rounded-2xl shadow-xl transition-all duration-300
        flex flex-col items-center justify-center space-y-4 
        ${
          isDisabled
            ? "opacity-50 cursor-not-allowed"
            : "transform hover:scale-105 hover:shadow-2xl cursor-pointer active:scale-[0.98] animate-fade-in-up"
        }
      `}
      aria-disabled={isDisabled}
    >
      <div className={`pt-3 rounded-full bg-white bg-opacity-20 aspect-square`}>
        <span className="text-6xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold mt-2">{name}</h3>
      <p className="text-sm opacity-80 uppercase tracking-widest">
        Nhấp để ra .... câu hỏi
      </p>
    </div>
  );
};

export default TopicCard;