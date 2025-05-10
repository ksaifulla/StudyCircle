import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from '../config';

const QuizAttempt = () => {
  const { groupId, quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isPaused, setIsPaused] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/v1/groups/${groupId}/quizzes/${quizId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuiz(res.data.quiz);
        setAnswers(new Array(res.data.quiz.questions.length).fill(null));
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuiz();
  }, [groupId, quizId, token]);

  useEffect(() => {
    if (timeLeft <= 0 && !submitted) {
      setSubmitted(true);
      handleSubmit();
    }

    if (submitted || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted, isPaused]);

  const handleOptionChange = (questionIndex, optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    if (submitted || isPaused) return;

    const formattedAnswers = answers.map((optIndex, index) => ({
      questionId: quiz.questions[index]._id,
      selectedOption: quiz.questions[index].options[optIndex]?.text || "",
    }));

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/groups/${groupId}/quizzes/${quizId}/attempt`,
        { answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScore(res.data.score);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePauseResume = () => {
    setIsPaused((prev) => !prev);
  };

  const handleRestart = () => {
    setSubmitted(false);
    setTimeLeft(5 * 60);
    setAnswers(new Array(quiz.questions.length).fill(null));
    setIsPaused(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!quiz)
    return (
      <div className="text-white p-6 text-center text-lg animate-pulse">
        Loading quiz...
      </div>
    );

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-fuchsia-900 via-zinc-800 to-gray-900 text-white">
      {/* Header Section */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md">
        <h2 className="text-3xl font-bold">{quiz.title}</h2>
        <div
          className={`px-4 py-2 rounded-lg font-semibold ${
            timeLeft <= 30 ? "bg-red-600" : "bg-purple-700"
          }`}
        >
          ⏳ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Progress Bar */}
        <div className="bg-gray-700 h-2 rounded-lg mb-6">
          <div
            className="h-2 bg-green-600 rounded-lg transition-all duration-1000"
            style={{ width: `${(timeLeft / (5 * 60)) * 100}%` }}
          ></div>
        </div>

        {/* Pause, Restart & Submit Buttons */}
        {!submitted && (
          <div className="mb-6 flex justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={handlePauseResume}
                className="px-4 py-2 bg-purple-700 rounded-lg font-semibold hover:bg-purple-800 transition"
              >
                {isPaused ? "▶️ Resume" : "⏸️ Pause"}
              </button>

              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-purple-700 rounded-lg font-semibold hover:bg-purple-800 transition"
              >
                🔄 Restart Quiz
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={timeLeft === 0 || isPaused}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                timeLeft === 0 || isPaused
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-purple-700 hover:bg-purple-800"
              }`}
            >
              Submit Quiz
            </button>
          </div>
        )}

        {/* Quiz Questions */}
        {quiz.questions.map((q, qIndex) => {
          const correctIndex = q.options.findIndex((opt) => opt.isCorrect);
          const selectedIndex = answers[qIndex];

          return (
            <div
              key={qIndex}
              className="border border-gray-700 p-5 rounded-lg shadow-md bg-gray-800 max-w-3xl mx-auto mb-6"
            >
              <h3 className="font-semibold mb-3 text-lg">
                Q{qIndex + 1}: {q.questionText}
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, optIndex) => {
                  let ringColor = "";
                  if (submitted) {
                    if (optIndex === selectedIndex && optIndex !== correctIndex) {
                      ringColor = "ring-2 ring-red-500";
                    } else if (optIndex === correctIndex) {
                      ringColor = "ring-2 ring-green-500";
                    }
                  }

                  return (
                    <label
                      key={optIndex}
                      className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded-lg transition"
                    >
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={optIndex}
                        checked={selectedIndex === optIndex}
                        onChange={() => handleOptionChange(qIndex, optIndex)}
                        disabled={submitted}
                        className={`w-5 h-5 appearance-none border border-gray-400 rounded-full checked:bg-blue-500 ${submitted ? ringColor : ""}`}
                      />
                      {opt.text}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Score & Back Button */}
      {submitted && (
        <div className="p-4 bg-gray-800 text-center">
          <p className="text-green-400 text-lg font-semibold">
            🎯 Your Score: {score} / {quiz.questions.length}
          </p>
          <button
            onClick={() => navigate(`/group/${groupId}/quizzes`)}
            className="bg-yellow-600 mt-3 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition"
          >
            Back to Quizzes
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizAttempt;
