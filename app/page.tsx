"use client";

import React, { useState, useEffect } from "react";
import quizData from "@/data/quizData.json";
import TopicCard from "@/components/TopicCard";
import Timer from "@/components/Timer";
import ScoreControls from "@/components/ScoreControls";
import useSound from "@/hooks/useSound";
import { Topic, QuizData, QuizState, Question } from "@/types";
import { useAudioContext } from "@/hooks/useAudioContext";

const data: QuizData = quizData as QuizData;

const TIME_PER_QUESTION = 5;

// --- SoundToggleIcon Component (Giữ nguyên) ---
const SoundToggleIcon: React.FC = () => {
  const { isMuted, toggleMute } = useAudioContext();

  const SpeakerIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1V9a1 1 0 011-1h1.586l4.414-4.414A1 1 0 0111 4v16a1 1 0 01-1.414.707L5.586 15z"
      />
    </svg>
  );

  const MuteIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.586 15H4a1 1 0 01-1-1V9a1 1 0 011-1h1.586l4.414-4.414A1 1 0 0111 4v16a1 1 0 01-1.414.707L5.586 15zM17 9l5 5m0-5l-5 5"
      />
    </svg>
  );

  return (
    <button
      onClick={toggleMute}
      className={`fixed bottom-8 right-8 p-4 rounded-full shadow-2xl transition-all duration-300 transform 
                        ${
                          isMuted
                            ? "bg-gray-400 text-white hover:scale-105"
                            : "bg-m-fuchsia text-white hover:scale-110 animate-pulse-light"
                        }`}
      aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
    >
      {isMuted ? MuteIcon : SpeakerIcon}
    </button>
  );
};
// ------------------------------------

const QuizGame: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>("topics");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerResetKey, setTimerResetKey] = useState(0); // State để reset timer

  // --- Âm thanh ---
  // VUI LÒNG ĐẢM BẢO CÁC FILE NÀY TỒN TẠI VỚI ĐÚNG TÊN HOẶC ĐỔI LẠI ĐÚNG TÊN CỦA BẠN
  const { play: playSelect } = useSound("/sounds/select_topic.mp3");
  const { play: playTick, stop: stopTick } = useSound("/sounds/tick.mp3");
  const { play: playCorrect } = useSound("/sounds/correct.mp3");
  const { play: playWrong } = useSound("/sounds/incorrect.wav");
  const { play: playTimeUp } = useSound("/sounds/time_up.mp3");
  const { play: playVictory, stop: stopVictory} = useSound("/sounds/victory1.mp3");
  const { play: playBgMusic, stop: stopBgMusic } = useSound(
    "/sounds/bg_music.mp3",
    true
  );

  // --- LOGIC NHẠC NỀN (ĐÃ SỬA LỖI LOOP) ---
  useEffect(() => {
    if (quizState === "topics") {
      playBgMusic();
    } else {
      stopBgMusic();
    }
  }, [quizState, playBgMusic, stopBgMusic]);

  // Logic kiểm tra điều kiện chiến thắng (KHÔNG GỌI setState LẶP LẠI)
  useEffect(() => {
    // Chỉ kiểm tra khi quiz đang chạy VÀ chưa đạt trạng thái WIN/LOSE
    if (quizState === "quiz" && isTimerRunning && score >= targetScore) {
      // Gọi setState chỉ một lần để chuyển trạng thái
      setIsTimerRunning(false);
      stopTick();
      stopBgMusic();
      playCorrect();
      setTimeout(() => {
        setQuizState("win");
        playVictory()
      } , 500);
    }
    // Dependency array đã được kiểm tra và an toàn
  }, [score, targetScore, quizState, isTimerRunning, playCorrect, stopBgMusic]);

  // --- Logic Xử lý Trò chơi ---

  const handleSelectTopic = (topic: Topic) => {
    const question = data.questions.find((q) => q.topicId === topic.id) || null;

    setSelectedTopic(topic);
    setCurrentQuestion(question);
    setScore(0);
    setTargetScore(0);
    setIsTimerRunning(false);

    playSelect();
    setTimeout(() => {
      setQuizState("preview");
    }, 300);
  };

  const handleStartGame = () => {
    if (!currentQuestion || targetScore < 1) return;
    playSelect();
    setIsTimerRunning(true);
    setQuizState("quiz");
  };

  const handleTimeUp = () => {
    setIsTimerRunning(false);
    stopTick();
    playTimeUp();
    setQuizState("lose");
  };

  const handleUpdateScore = (
    newScore: number,
    actionType: "correct" | "wrong"
  ) => {
    if (!isTimerRunning) return;
    setScore(newScore);
    if (actionType === "correct") {
      setTimerResetKey((prev) => prev + 1); // Kích hoạt reset timer
      playCorrect();
    } else if (actionType === "wrong") {
      playWrong();
    }
  };

  const handleRestart = () => {
    setSelectedTopic(null);
    setCurrentQuestion(null);
    stopVictory();
    setQuizState("topics");
    setScore(0);
    setTargetScore(3);
    setIsTimerRunning(false);
  };

  // --- Rendering ---

  const renderContent = () => {
    if (quizState === "topics") {
      return (
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-m-purple mb-4 animate-fade-in-up">
            AI thông minh hơn nhân viên Midu
          </h1>
          <p className="text-gray-600 mb-12 animate-fade-in-up">
            Chọn chủ đề để xem câu hỏi và bắt đầu trò chơi.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            {data.topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onSelect={handleSelectTopic}
              />
            ))}
          </div>
        </div>
      );
    }

    if (quizState === "preview" && selectedTopic && currentQuestion) {
      return (
        <div className="flex flex-col items-center w-full max-w-2xl bg-white p-8 md:p-12 rounded-2xl shadow-2xl animate-fade-in-up">
          <h3 className="text-2xl font-semibold text-m-fuchsia mb-2 uppercase">
            CHỦ ĐỀ: {selectedTopic.name}
          </h3>
          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
            {currentQuestion.question}
          </h2>

          <div className="mt-4 mb-8 w-full max-w-sm">
            <ScoreControls
              score={score}
              targetScore={targetScore}
              setTargetScore={setTargetScore}
              onUpdateScore={handleUpdateScore}
              isDisabled={false}
            />
          </div>

          <button
            onClick={handleStartGame}
            className="w-full py-4 bg-green-500 text-white font-black rounded-lg text-xl hover:bg-green-600 transition duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg"
          >
            🚀 BẮT ĐẦU TRẢ LỜI
          </button>

          <button
            onClick={handleRestart}
            className="mt-4 text-sm text-gray-500 hover:text-m-purple transition cursor-pointer hover:text-blue-700"
          >
            Quay lại chọn chủ đề
          </button>
        </div>
      );
    }

    if (quizState === "quiz" && selectedTopic && currentQuestion) {
      return (
        <div className="flex flex-col items-center w-full max-w-2xl bg-white p-8 md:p-12 rounded-2xl shadow-2xl animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            {currentQuestion.question}
          </h2>

          <Timer
            initialTime={TIME_PER_QUESTION}
            onTimeUp={handleTimeUp}
            onTick={() => playTick()}
            key={currentQuestion.topicId}
            resetKey={timerResetKey}
            isRunning={isTimerRunning}
          />

          <div className="mt-8 mb-4 w-full max-w-sm">
            <ScoreControls
              score={score}
              targetScore={targetScore}
              setTargetScore={setTargetScore}
              onUpdateScore={handleUpdateScore}
              isDisabled={true}
            />
          </div>
        </div>
      );
    }

    if (quizState === "win" && selectedTopic) {
      return (
        <div className="flex flex-col items-center w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl animate-fade-in-up text-center border-4 border-green-500">
          <span className="text-8xl mb-4 animate-bounce">🏆</span>
          <h2 className="text-3xl font-extrabold text-green-600 mb-4">
            CHÚC MỪNG CHIẾN THẮNG!
          </h2>
          <p className="text-xl text-gray-700 mb-6">
            Bạn đã đạt được **{score}/{targetScore}** đáp án đúng trong thời
            gian quy định!
          </p>
          <button
            onClick={handleRestart}
            className="mt-4 w-full py-3 bg-m-purple text-white font-semibold rounded-lg hover:bg-m-fuchsia transition duration-300 transform hover:scale-[1.02] shadow-lg"
          >
            CHỌN CHỦ ĐỀ MỚI
          </button>
        </div>
      );
    }

    if (quizState === "lose" && selectedTopic) {
      return (
        <div className="flex flex-col items-center w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl animate-fade-in-up text-center border-4 border-red-500">
          <span className="text-8xl mb-4 animate-shake">😭</span>
          <h2 className="text-3xl font-extrabold text-red-600 mb-4">
            THUA CUỘC!
          </h2>
          <p className="text-xl text-gray-700 mb-6">
            Hết giờ! Bạn chỉ đạt được **{score}/{targetScore}** đáp án đúng.
          </p>
          <button
            onClick={handleRestart}
            className="mt-4 w-full py-3 bg-m-purple text-white font-semibold rounded-lg hover:bg-m-fuchsia transition duration-300 transform hover:scale-[1.02] shadow-lg"
          >
            THỬ LẠI
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <main className="min-h-screen flex flex-col items-center py-16 px-4 font-sans">
      <div className="container max-w-6xl text-center flex justify-center">
        {renderContent()}
      </div>
      <SoundToggleIcon />
    </main>
  );
};

export default QuizGame;
