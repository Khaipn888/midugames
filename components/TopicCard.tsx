// File: src/components/TopicCard.tsx
'use client'; // <-- Bắt buộc phải là Client Component

import React from 'react';
import { Topic } from '@/types'; // Sử dụng alias @/types

interface TopicCardProps {
  topic: Topic;
  onSelect: (topic: Topic) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onSelect }) => {
  // ... (Nội dung component TopicCard giữ nguyên)
  const { name, icon, color } = topic;

  return (
    <div
      onClick={() => onSelect(topic)}
      className={`
        ${color} text-white p-8 rounded-2xl shadow-xl transition-all duration-300
        transform hover:scale-105 hover:shadow-2xl cursor-pointer
        flex flex-col items-center justify-center space-y-4 animate-fade-in-up
        active:scale-[0.98]
      `}
    >
      <div className={`p-4 rounded-full bg-white bg-opacity-20`}>
        <span className="text-5xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold mt-2">{name}</h3>
      <p className="text-sm opacity-80 uppercase tracking-widest">
        Nhấp để ra .... câu hỏi
      </p>
    </div>
  );
};

export default TopicCard;