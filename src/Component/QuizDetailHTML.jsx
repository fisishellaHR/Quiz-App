import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const QuizDetailHTML = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/questions/quiz/${quizId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setQuiz(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError("Failed to fetch quiz");
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/questions/html/${quizId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userAnswers),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit answers");
      }

      const result = await response.json();
      setResult(result);
    } catch (error) {
      console.error("Error submitting answers:", error);
      setError("Failed to submit answers");
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!quiz) {
    return <div className="text-center text-gray-500">No quiz found</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-no-repeat bg-primary w-full h-full p-6">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">{quiz.title}</h1>
        <p className="text-gray-600 mb-4">Pass Grade: {quiz.passGrade}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {quiz.questions.map((question, index) => (
            <div
              key={index}
              className="mb-6 p-4 border border-gray-200 rounded-lg"
            >
              <p className="text-lg font-semibold mb-2">{question.question}</p>
              <div className="space-y-2 mb-4">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      className="form-radio text-blue-500"
                      checked={userAnswers[index] === option}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                    />
                    <label className="ml-2 text-gray-800">{option}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-hover transition"
          >
            Submit
          </button>
        </form>
        {result && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Results</h3>
            <p
              className={`text-lg ${
                result.passed ? "text-green-500" : "text-red-500"
              }`}
            >
              {result.message}
            </p>
            <p className="text-lg font-medium">Score: {result.score}</p>
            <p className="text-lg font-medium">
              Correct Answers: {result.correctAnswers}
            </p>
            <p className="text-lg font-medium">
              Wrong Answers: {result.wrongAnswers}
            </p>
            <h4 className="text-md font-semibold mt-4">Details:</h4>
            <ul className="mt-2 space-y-4">
              {result.details.map((detail, index) => (
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
    </div>
  );
};

export default QuizDetailHTML;
