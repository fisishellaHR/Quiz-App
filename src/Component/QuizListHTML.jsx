/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

const QuizListHTML = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState({});

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/questions/html/all"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setQuizzes(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setError("Failed to fetch quizzes");
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleAnswerChange = (quizId, questionIndex, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [quizId]: {
        ...(prevAnswers[quizId] || {}),
        [questionIndex]: answer,
      },
    }));
  };

  const handleSubmit = async (quizId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/questions/html/${quizId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userAnswers[quizId] || {}),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit answers");
      }

      const result = await response.json();
      setResults((prevResults) => ({
        ...prevResults,
        [quizId]: result,
      }));
    } catch (error) {
      console.error("Error submitting answers:", error);
      setError("Failed to submit answers");
    }
  };

  const getAnswerFeedback = (question, userAnswer) => {
    if (userAnswer === question.correctAnswer.trim().toLowerCase()) {
      return { status: "Correct", color: "text-green-700" };
    } else {
      return { status: "Incorrect", color: "text-red-700" };
    }
  };

  const getQuizStatistics = (quizId) => {
    const details = results[quizId]?.details || [];
    const correctAnswers = details.filter((detail) => detail.correct).length;
    const totalQuestions = details.length;
    return {
      correct: correctAnswers,
      wrong: totalQuestions - correctAnswers,
    };
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-no-repeat bg-primary w-full h-full p-6">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">All Quizzes</h1>
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="mb-6">
            <h2 className="text-xl font-semibold mb-4">{quiz.title}</h2>
            <p className="text-gray-600 mb-4">Pass Grade: {quiz.passGrade}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(quiz._id);
              }}
            >
              {quiz.questions.map((question, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border border-gray-200 rounded-lg"
                >
                  <p className="text-lg font-semibold mb-2">
                    {question.question}
                  </p>
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center">
                        <input
                          type="radio"
                          name={`quiz-${quiz._id}-question-${index}`}
                          value={option}
                          className="form-radio text-blue-500"
                          onChange={() =>
                            handleAnswerChange(quiz._id, index, option)
                          }
                        />
                        <label className="ml-2">{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Submit
              </button>
            </form>
            {results[quiz._id] && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Results</h3>
                <p className="text-gray-700">{results[quiz._id].message}</p>
                <p className="text-gray-700">
                  Score: {results[quiz._id].score.toFixed(2)}%
                </p>
                <p className="text-gray-700">
                  Correct Answers: {getQuizStatistics(quiz._id).correct} /{" "}
                  {quiz.questions.length}
                </p>
                <p className="text-gray-700">
                  Incorrect Answers: {getQuizStatistics(quiz._id).wrong} /{" "}
                  {quiz.questions.length}
                </p>
                <ul className="mt-4">
                  {results[quiz._id].details.map((detail, idx) => (
                    <li
                      key={idx}
                      className={`text-lg ${
                        detail.correct ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      <strong>{detail.question}</strong>
                      <br />
                      <span>User Answer: {detail.userAnswer}</span>
                      <br />
                      <span>Correct Answer: {detail.correctAnswer}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizListHTML;
