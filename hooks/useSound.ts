import { useState, useEffect, useCallback } from 'react';
import { useAudioContext } from './useAudioContext';

const useSound = (url: string, loop: boolean = false) => {
  // 1. Chỉ khởi tạo Audio object một lần dựa trên URL
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { registerAudio, isMuted } = useAudioContext();

  // EFFECT 1: KHỞI TẠO AUDIO OBJECT (Chỉ chạy khi URL hoặc LOOP thay đổi)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audioObj = new Audio(url);
    audioObj.loop = loop;
    
    // Gán Audio object, KÍCH HOẠT render LẦN 1
    setAudio(audioObj);
    
    // Đăng ký Audio object, hàm này phải được memoize bằng useCallback trong useAudioContext
    registerAudio(audioObj); 

    return () => {
      audioObj.pause();
      // NOTE: Bạn cần đảm bảo AudioProvider có logic để loại bỏ Audio object không còn cần thiết.
    };
    
    // Dependencies chỉ bao gồm những thứ cần thiết để TẠO Audio object
  }, [url, loop, registerAudio]); 


  // EFFECT 2: CẬP NHẬT TRẠNG THÁI MUTE (Chỉ chạy khi isMuted thay đổi)
  useEffect(() => {
    // Không gọi setState, chỉ cập nhật thuộc tính của Audio object đã tồn tại
    if (audio) {
        audio.muted = isMuted; 
    }
  }, [audio, isMuted]); // Chạy lại khi audio object đã sẵn sàng và isMuted thay đổi


  const play = useCallback((volume: number = 1) => {
    if (audio) {
        audio.volume = volume;
        audio.pause();
        audio.currentTime = 0;
        // Kiểm tra isMuted trước khi play (dù context đã xử lý, đây là biện pháp phòng ngừa)
        if (!isMuted) {
            audio.play().catch(error => {
                console.error("Audio play failed (Autoplay policy or error):", error);
            });
        }
    }
  }, [audio, isMuted]); // Thêm isMuted vào dependencies

  const stop = useCallback(() => {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
  }, [audio]);

  return { play, stop, audio };
};

export default useSound;