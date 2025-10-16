"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback, // IMPORT MỚI
} from "react";

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  registerAudio: (audio: HTMLAudioElement) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  // Trạng thái mute được lưu trữ cục bộ
  const [isMuted, setIsMuted] = useState(true); // Danh sách các Audio objects đang hoạt động
  const [audioElements, setAudioElements] = useState<HTMLAudioElement[]>([]); // 1. Hàm bật/tắt (ĐÃ GÓI TRONG useCallback)

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []); // Dependency array rỗng: Hàm không bao giờ thay đổi // 2. Hàm đăng ký Audio object (ĐÃ GÓI TRONG useCallback)

  const registerAudio = useCallback((audio: HTMLAudioElement) => {
    // setAudioElements là hàm setter, không cần là dependency
    setAudioElements((prev) => {
      // Lọc các phần tử không còn trong DOM
      const updatedList = [...prev.filter((a) => a.parentElement), audio];
      return Array.from(new Set(updatedList));
    });
  }, []); // Dependency array rỗng: Hàm không bao giờ thay đổi // 3. Effect: Áp dụng trạng thái mute cho TẤT CẢ Audio objects
  // Lưu ý: setAudioElements được đảm bảo ổn định (stable) trong React.

  useEffect(() => {
    audioElements.forEach((audio) => {
      audio.muted = isMuted;
    });
  }, [isMuted, audioElements]); // Chạy lại khi trạng thái mute hoặc danh sách audio thay đổi

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, registerAudio }}>
      {children}{" "}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
};
