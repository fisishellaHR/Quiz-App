import { useEffect, useState } from "react";

const QuizListCSS = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState({});
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("http://localhost:3001/questions/css/all");
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
    // Validasi: Periksa apakah semua pertanyaan telah dijawab
    const quiz = quizzes.find((q) => q._id === quizId);
    const unansweredQuestions = quiz.questions.filter(
      (_, index) => !userAnswers[quizId]?.[index]
    );
    if (unansweredQuestions.length > 0) {
      setValidationError("Please answer all questions before submitting.");
      return;
    }

    setValidationError(""); // Clear previous validation error

    try {
      const response = await fetch(
        `http://localhost:3001/questions/css/${quizId}/submit`,
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
    if (userAnswer === question.correctAnswer) {
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

  if (quizzes.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-center text-gray-500 text-xl">
          No quizzes available at the moment. Please check back later!
        </p>
      </div>
    );
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
                          onChange={(e) =>
                            handleAnswerChange(quiz._id, index, e.target.value)
                          }
                        />
                        <label className="ml-2 text-gray-800">{option}</label>
                      </div>
                    ))}
                  </div>
                  {results[quiz._id]?.details[index] && (
                    <div className="mt-2">
                      <p className="font-semibold">Your Answer:</p>
                      <p
                        className={`${
                          getAnswerFeedback(
                            question,
                            userAnswers[quiz._id]?.[index]
                          )?.color
                        }`}
                      >
                        {userAnswers[quiz._id]?.[index] || "Not answered"}
                      </p>
                      <p className="font-semibold mt-2">Correct Answer:</p>
                      <p className="text-gray-800">{question.correctAnswer}</p>
                      <p className="font-semibold mt-2">Status:</p>
                      <p
                        className={`${
                          getAnswerFeedback(
                            question,
                            userAnswers[quiz._id]?.[index]
                          )?.color
                        }`}
                      >
                        {
                          getAnswerFeedback(
                            question,
                            userAnswers[quiz._id]?.[index]
                          )?.status
                        }
                      </p>
                    </div>
                  )}
                </div>
              ))}
              {validationError && (
                <div className="text-red-500 mb-4">{validationError}</div>
              )}
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-hover transition"
              >
                Submit
              </button>
            </form>
            {results[quiz._id] && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Results</h3>
                <p
                  className={`text-lg ${
                    results[quiz._id].passed ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {results[quiz._id].message}
                </p>
                <p className="text-lg font-medium">
                  Score: {results[quiz._id].score}
                </p>
                <p className="text-lg font-medium">
                  Correct Answers: {getQuizStatistics(quiz._id).correct}
                </p>
                <p className="text-lg font-medium">
                  Wrong Answers: {getQuizStatistics(quiz._id).wrong}
                </p>
                <h4 className="text-md font-semibold mt-4">Details:</h4>
                <ul className="mt-2 space-y-4">
                  {results[quiz._id].details.map((detail, index) => (
                    <li
                      key={index}
                      className={`p-4 border rounded-lg ${
                        detail.correct ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <p className="font-semibold">Question:</p>
                      <p>{detail.question}</p>
                      <p className="font-semibold mt-2">Your Answer:</p>
                      <p
                        className={`${
                          detail.correct ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {detail.userAnswer}
                      </p>
                      <p className="font-semibold mt-2">Correct Answer:</p>
                      <p className="text-gray-800">{detail.correctAnswer}</p>
                      <p className="font-semibold mt-2">Status:</p>
                      <p
                        className={`${
                          detail.correct ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {detail.correct ? "Correct" : "Incorrect"}
                      </p>
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

export default QuizListCSS;
