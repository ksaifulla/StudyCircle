// import React, { useState } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { useParams, useNavigate } from 'react-router-dom';

// const CreateQuiz = () => {
//   const { groupId } = useParams();
//   const navigate = useNavigate();
//   const { token } = useSelector((state) => state.auth);

//   const [title, setTitle] = useState('');
//   const [questions, setQuestions] = useState([
//     { questionText: '', options: ['', '', '', ''], correctOption: '' },
//   ]);

//   const handleQuestionChange = (index, field, value) => {
//     const updatedQuestions = [...questions];
//     if (field === 'questionText') {
//       updatedQuestions[index].questionText = value;
//     } else if (field.startsWith('option')) {
//       const optionIndex = parseInt(field.split('-')[1]);
//       updatedQuestions[index].options[optionIndex] = value;
//     } else if (field === 'correctOption') {
//       updatedQuestions[index].correctOption = value;
//     }
//     setQuestions(updatedQuestions);
//   };

//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       { questionText: '', options: ['', '', '', ''], correctOption: '' },
//     ]);
//   };

//   const removeQuestion = (index) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions.splice(index, 1);
//     setQuestions(updatedQuestions);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         `http://localhost:5000/api/v1/groups/${groupId}/quizzes`,
//         {
//           title,
//           questions,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       navigate(`/groups/${groupId}/quizzes`);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="p-6 text-white">
//       <h2 className="text-2xl font-bold mb-4">Create New Quiz</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">

//         <div>
//           <label className="block mb-1">Quiz Title:</label>
//           <input
//             type="text"
//             className="w-full bg-gray-800 p-2 rounded"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//         </div>

//         {questions.map((q, index) => (
//           <div key={index} className="border border-gray-600 p-4 rounded">
//             <h3 className="font-semibold mb-2">Question {index + 1}</h3>

//             <input
//               type="text"
//               placeholder="Question Text"
//               className="w-full bg-gray-800 p-2 rounded mb-2"
//               value={q.questionText}
//               onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
//               required
//             />

//             <div className="grid grid-cols-2 gap-2 mb-2">
//               {q.options.map((opt, i) => (
//                 <input
//                   key={i}
//                   type="text"
//                   placeholder={`Option ${i + 1}`}
//                   className="bg-gray-800 p-2 rounded"
//                   value={opt}
//                   onChange={(e) => handleQuestionChange(index, `option-${i}`, e.target.value)}
//                   required
//                 />
//               ))}
//             </div>

//             <input
//               type="text"
//               placeholder="Correct Option Text"
//               className="w-full bg-gray-800 p-2 rounded mb-2"
//               value={q.correctOption}
//               onChange={(e) => handleQuestionChange(index, 'correctOption', e.target.value)}
//               required
//             />

//             <button
//               type="button"
//               onClick={() => removeQuestion(index)}
//               className="bg-red-600 px-3 py-1 rounded"
//             >
//               Remove Question
//             </button>
//           </div>
//         ))}

//         <div className="flex gap-4">
//           <button
//             type="button"
//             onClick={addQuestion}
//             className="bg-yellow-600 px-4 py-2 rounded"
//           >
//             Add Question
//           </button>

//           <button type="submit" className="bg-green-600 px-4 py-2 rounded">
//             Create Quiz
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateQuiz;

import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctOption: '' },
  ]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === 'questionText') {
      updatedQuestions[index].questionText = value;
    } else if (field.startsWith('option')) {
      const optionIndex = parseInt(field.split('-')[1]);
      updatedQuestions[index].options[optionIndex] = value;
    } else if (field === 'correctOption') {
      updatedQuestions[index].correctOption = value;
    }
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', options: ['', '', '', ''], correctOption: '' },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedQuestions = questions.map((q) => ({
      questionText: q.questionText,
      options: q.options.map((opt) => ({
        text: opt,
        isCorrect: opt === q.correctOption,
      })),
    }));

    try {
      await axios.post(
        `http://localhost:5000/api/v1/groups/${groupId}/quizzes`,
        {
          title,
          questions: formattedQuestions,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(`/group/${groupId}/quizzes`);
    } catch (err) {
      console.error("Error creating quiz:", err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="mx-auto bg-gradient-to-b from-fuchsia-900 via-zinc-800 to-gray-900 text-white w-full h-full overflow-y-auto">
      
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        Create a New Quiz
      </h2>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        
        {/* Quiz Title */}
        <div>
          <label className="block mb-2 text-2xl font-semibold">Quiz Title:</label>
          <input
            type="text"
            className="w-full bg-gray-800 text-white p-3 rounded border border-gray-700 focus:border-fuchsia-500 focus:ring focus:ring-fuchsia-500 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Questions Container */}
        <div className="max-h-[55vh] overflow-y-auto space-y-6 p-2">
          {questions.map((q, index) => (
            <div key={index} className="bg-gray-800 p-5 rounded-lg shadow-lg relative border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                Question {index + 1}
              </h3>

              {/* Question Input */}
              <input
                type="text"
                placeholder="Enter your question here"
                className="w-full bg-gray-900 text-white p-3 rounded border border-gray-700 focus:border-fuchsia-500 focus:ring focus:ring-fuchsia-500 outline-none"
                value={q.questionText}
                onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                required
              />

              {/* Options */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {q.options.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    className="bg-gray-900 text-white p-2 rounded border border-gray-700 focus:border-fuchsia-500 focus:ring focus:ring-fuchsia-500 outline-none"
                    value={opt}
                    onChange={(e) => handleQuestionChange(index, `option-${i}`, e.target.value)}
                    required
                  />
                ))}
              </div>

              {/* Correct Option */}
              <input
                type="text"
                placeholder="Enter the correct answer"
                className="w-full mt-4 bg-gray-900 text-white p-3 rounded border border-green-500 focus:ring focus:ring-green-500 outline-none"
                value={q.correctOption}
                onChange={(e) => handleQuestionChange(index, 'correctOption', e.target.value)}
                required
              />

              {/* Remove Question Button */}
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-semibold"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Fixed Buttons */}
        <div className="fixed bottom-0 left-0 w-full bg-transparent p-4 flex justify-center gap-6  shadow-lg">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-lg font-semibold transition"
          >
            ➕ Add Question
          </button>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition"
          >
            ✅ Create Quiz
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateQuiz;

