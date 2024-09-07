import { useState } from "react";

const QuizCreation = () => {
  const [quiz, setQuiz] = useState({
    title: "",
    questions: [
      {
        question: "",
        options: [""],
        correctAnswer: "",
      },
    ],
    passGrade: 70,
  });

  const [category, setCategory] = useState("html");

  // Handle perubahan opsi
  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const newOptions = [...quiz.questions[questionIndex].options];
    newOptions[optionIndex] = event.target.value;
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((q, i) =>
        i === questionIndex ? { ...q, options: newOptions } : q
      ),
    });
  };

  // Handle perubahan pertanyaan
  const handleQuestionChange = (index, event) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((q, i) =>
        i === index ? { ...q, question: event.target.value } : q
      ),
    });
  };

  // Handle perubahan jawaban benar
  const handleCorrectAnswerChange = (questionIndex, event) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((q, i) =>
        i === questionIndex ? { ...q, correctAnswer: event.target.value } : q
      ),
    });
  };

  // Menambah pertanyaan baru
  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        { question: "", options: [""], correctAnswer: "" },
      ],
    });
  };

  // Menambah opsi baru
  const addOption = (questionIndex) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((q, i) =>
        i === questionIndex ? { ...q, options: [...q.options, ""] } : q
      ),
    });
  };

  // Menghapus opsi
  const removeOption = (questionIndex, optionIndex) => {
    const newOptions = quiz.questions[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((q, i) =>
        i === questionIndex ? { ...q, options: newOptions } : q
      ),
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/questions/${category}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quiz),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Quiz created:", data);

      // Tambahkan logika pasca-submisi seperti reset form atau menampilkan pesan sukses
      setQuiz({
        title: "",
        questions: [
          {
            question: "",
            options: [""],
            correctAnswer: "",
          },
        ],
        passGrade: 70,
      });
      alert("Quiz created successfully!");
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4 text-primary text-center">
        Create New Quiz
      </h1>
      <form
        className="p-4 bg-primary shadow-lg rounded max-w-3xl mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block text-base font-bold mb-2" htmlFor="select">
            Option Create Quiz
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full mb-4"
          >
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
          <label className="block text-base font-bold mb-2" htmlFor="quizTitle">
            Title:
          </label>
          <input
            type="text"
            id="quizTitle"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            placeholder="Quiz Title"
            className="w-full p-2 border rounded border-gray-300"
          />
        </div>
        {quiz.questions.map((q, questionIndex) => (
          <div key={questionIndex} className="mb-6">
            <label
              className="block text-base font-bold mb-2"
              htmlFor={`question-${questionIndex}`}
            >
              Question:
            </label>
            <input
              type="text"
              id={`question-${questionIndex}`}
              value={q.question}
              onChange={(e) => handleQuestionChange(questionIndex, e)}
              placeholder="Question"
              className="w-full p-2 border rounded border-gray-300 mb-4"
            />
            {q.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className="flex flex-col sm:flex-row items-start sm:items-center mb-2"
              >
                <input
                  type="text"
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(questionIndex, optionIndex, e)
                  }
                  placeholder={`Option ${optionIndex + 1}`}
                  className="w-full p-2 border rounded border-gray-300 mb-2 sm:mb-0 sm:mr-2"
                />
                <button
                  type="button"
                  onClick={() => removeOption(questionIndex, optionIndex)}
                  className="bg-secondary hover:bg-black text-white px-2 py-1 rounded mb-2 sm:mb-0"
                >
                  Remove Option
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(questionIndex)}
              className="bg-secondary hover:bg-black text-white px-4 py-2 rounded transition mb-4"
            >
              Add Option
            </button>
            <div className="mt-4">
              <label className="block text-base font-bold mb-2">
                Correct Answer:
              </label>
              <input
                type="text"
                value={q.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(questionIndex, e)}
                placeholder="Correct Answer"
                className="w-full p-2 border rounded border-gray-300 mb-4"
              />
            </div>
          </div>
        ))}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-secondary hover:bg-black text-white px-4 py-2 rounded transition mb-4 sm:mb-0"
          >
            Add Question
          </button>
          <button
            type="submit"
            className="bg-secondary hover:bg-black text-white px-4 py-2 rounded transition mb-4 sm:mb-0"
          >
            Create Quiz
          </button>
        </div>
      </form>
    </>
  );
};

export default QuizCreation;
