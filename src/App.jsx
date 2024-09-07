import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuizListHTML from "./Component/QuizListHTML";
import QuizPage from "./Component/QuizPage";
import QuizDetailHTML from "./Component/QuizDetailHTML";
import QuizListCSS from "./Component/QuizListCSS";
import QuizCreation from "./Component/QuizCreation";
import ViewQuiz from "./Component/ViewQuiz";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/add-quiz" element={<QuizCreation />} />
        <Route path="/quiz-listhtml" element={<QuizListHTML />} />
        <Route path="/quiz-listcss" element={<QuizListCSS />} />
        <Route path="/quiz-edit" element={<ViewQuiz />} />
        <Route path="/" element={<QuizPage />} />
        <Route path="/quiz/:quizId" element={<QuizDetailHTML />} />
      </Routes>
    </Router>
  );
}

export default App;
