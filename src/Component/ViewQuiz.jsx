import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Modal from "react-modal";
import "../ModalQuiz.css";

const ViewQuiz = () => {
  const [quizzes, setQuizzes] = useState({ html: [], css: [] });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [passGrade, setPassGrade] = useState("");
  const [route, setRoute] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    fetchQuizzes("html");
    fetchQuizzes("css");
  }, []);

  const fetchQuizzes = async (type) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/questions/${type}/all`
      );
      setQuizzes((prev) => ({ ...prev, [type]: response.data }));
    } catch (error) {
      console.error(`Error fetching ${type} quizzes:`, error.message);
    }
  };

  const deleteQuiz = async (quiz, type) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this quiz? This action cannot be undone!"
    );
    if (confirmation) {
      try {
        const response = await axios.delete(
          `http://localhost:3001/questions/${type}/quiz/${quiz._id}`
        );
        if (response.status === 200) {
          alert(`Quiz successfully deleted! 🎉`);
          type === "html" ? fetchQuizzes("html") : fetchQuizzes("css");
        } else {
          console.error(
            `Failed to delete ${type} quiz:`,
            response.status,
            response.data
          );
          alert(`Failed to delete ${type} quiz 😢: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error occurred:", error.message);
        alert(`Error deleting ${type} quiz 🤔: ${error.message}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    // Validasi
    if (!title.trim()) {
      setValidationError("Title is required.");
      return;
    }
    if (!passGrade || isNaN(passGrade) || passGrade <= 0) {
      setValidationError("Pass grade must be a positive number.");
      return;
    }
    for (const question of questions) {
      if (!question.question.trim()) {
        setValidationError("All questions must have text.");
        return;
      }
      if (question.options.every((option) => !option.trim())) {
        setValidationError("Each question must have at least one option.");
        return;
      }
      if (!question.correctAnswer.trim()) {
        setValidationError("Each question must have a correct answer.");
        return;
      }
    }

    try {
      await axios.put(
        `http://localhost:3001/questions/${route}/edit-multiple`,
        [{ _id: selectedQuiz._id, title, questions, passGrade }]
      );
      alert("Quiz successfully updated");
      fetchQuizzes("html");
      fetchQuizzes("css");
      setModalIsOpen(false);
    } catch (error) {
      alert("Error updating quiz: " + error.message);
      console.error("Error updating quiz:", error);
    }
  };

  const openModal = (quiz, type) => {
    setSelectedQuiz(quiz);
    setRoute(type);
    setTitle(quiz.title);
    setQuestions(quiz.questions);
    setPassGrade(quiz.passGrade);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleQuestionChange = (index, key, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [key]: value };
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctAnswer = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: [], correctAnswer: "" },
    ]);
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);
    setQuestions(updatedQuestions);
  };

  const renderQuizTable = (type) => (
    <div className="overflow-auto bg-primary shadow-md rounded-lg p-6 mb-10">
      <table className="min-w-full divide-y divide-primary">
        <thead className="bg-white">
          <tr>
            <th className="px-6 py-3 text-left text-lg font-extrabold text-primary uppercase tracking-wider border-r border-primary">
              Quiz Title ({type.toUpperCase()})
            </th>
            <th className="py-3 text-lg font-extrabold text-primary uppercase border-r border-primary">
              Detail Quiz
            </th>
            <th className="py-3 text-lg font-extrabold text-primary uppercase">
              Delete
            </th>
          </tr>
        </thead>
        <tbody className="bg-secondary divide-y divide-primary">
          {quizzes[type].length > 0 ? (
            quizzes[type].map((quiz) => (
              <tr key={quiz._id}>
                <td className="px-6 py-4 whitespace-nowrap text-base text-primary border-r border-primary">
                  {quiz.title}
                </td>
                <td className="px-1 py-2 whitespace-nowrap text-base text-primary border-r border-primary text-center">
                  <button
                    className="text-yellow-500 hover:text-yellow-700"
                    onClick={() => openModal(quiz, type)}
                  >
                    <FaEdit />
                  </button>
                </td>
                <td className="px-1 py-2 whitespace-nowrap text-base text-primary text-center">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteQuiz(quiz, type)}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="3"
                className="px-6 py-4 text-center text-base text-primary"
              >
                No {type.toUpperCase()} quizzes available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {renderQuizTable("html")}
      {renderQuizTable("css")}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Quiz"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedQuiz && (
          <div className="modal-content p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Quiz</h2>
            {validationError && (
              <p className="text-red-500 mb-4">{validationError}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label
                  htmlFor="quizTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="quizTitle"
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="passGrade"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pass Grade
                </label>
                <input
                  type="number"
                  id="passGrade"
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm w-full"
                  value={passGrade}
                  onChange={(e) => setPassGrade(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="questions"
                  className="block text-sm font-medium text-gray-700"
                >
                  Questions
                </label>
                {questions.map((question, qIndex) => (
                  <div key={qIndex} className="mb-4 border p-4 rounded-lg">
                    <div className="mb-2">
                      <label
                        htmlFor={`question${qIndex}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Question
                      </label>
                      <input
                        type="text"
                        id={`question${qIndex}`}
                        className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm w-full"
                        value={question.question}
                        onChange={(e) =>
                          handleQuestionChange(
                            qIndex,
                            "question",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        htmlFor={`options${qIndex}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Options
                      </label>
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="mb-2 flex items-center">
                          <input
                            type="text"
                            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm w-full"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(qIndex, oIndex, e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="ml-2 text-red-500"
                            onClick={() => deleteOption(qIndex, oIndex)}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="text-blue-500"
                        onClick={() => addOption(qIndex)}
                      >
                        Add Option
                      </button>
                    </div>
                    <div className="mb-2">
                      <label
                        htmlFor={`correctAnswer${qIndex}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Correct Answer
                      </label>
                      <input
                        type="text"
                        id={`correctAnswer${qIndex}`}
                        className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm w-full"
                        value={question.correctAnswer}
                        onChange={(e) =>
                          handleCorrectAnswerChange(qIndex, e.target.value)
                        }
                      />
                    </div>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => deleteQuestion(qIndex)}
                    >
                      Delete Question
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-blue-500"
                  onClick={addQuestion}
                >
                  Add Question
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 px-4 py-2 bg-gray-500 text-white rounded-md"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewQuiz;
