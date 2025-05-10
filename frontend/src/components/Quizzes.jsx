import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from '../config';

const Quizzes = () => {
  const { groupId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/v1/groups/${groupId}/quizzes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("API Response: ", res.data);
        setQuizzes(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuizzes();
  }, [groupId, token]);

  return (
    <div className="mx-auto w-full h-full p-6 text-white bg-gradient-to-b from-fuchsia-900 via-zinc-800 to-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Available Quizzes</h2>
        <button
          onClick={() => navigate(`/group/${groupId}/quizzes/create`)}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 hover:shadow-lg transition"
        >
          + Create Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-300">No quizzes available yet! 📜</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="border border-gray-700 bg-zinc-900 p-5 rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                {quiz.title}
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Created by: {quiz.createdBy?.name  || "Unknown"}
              </p>
              <p className="text-sm text-gray-400">
                  Created on: {new Date(quiz.createdAt).toLocaleString()}
                </p>
              <br/>
              <Link
                to={`/group/${groupId}/quizzes/${quiz._id}/attempt`}
                className="inline-block w-full text-center bg-purple-700 text-white py-2 rounded-md font-semibold shadow-md hover:scale-105 hover:shadow-lg transition"
              >
                Attempt Quiz
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quizzes;

