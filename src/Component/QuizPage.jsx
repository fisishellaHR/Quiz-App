import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const QuizPage = () => {
  return (
    <motion.div
      className="container mx-auto px-4 mb-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="text-center my-8" variants={itemVariants}>
        <h1 className="font-bowlby text-[40px] md:text-[80px] text-primary">
          Quiz Dashboard
        </h1>
      </motion.div>

      <motion.div
        className="bg-primary rounded-3xl flex flex-col items-center justify-center gap-12 py-12 mb-8"
        variants={itemVariants}
      >
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-x-20 text-white w-full lg:w-3/4"
          variants={itemVariants}
        >
          <div className="border-b-2 border-white text-center md:text-left w-full md:w-2/3">
            <h2 className="font-bowlby text-[32px] md:text-[48px]">
              Quiz Options
            </h2>
          </div>
        </motion.div>
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-x-20 text-white w-full lg:w-3/4"
          variants={itemVariants}
        >
          <Link
            to="/add-quiz"
            className="bg-white text-primary rounded-lg py-3 px-6 font-poppins text-lg hover:bg-gray-100 transition"
          >
            Masukin Quiz
          </Link>
          <Link
            to="/quiz-listhtml"
            className="bg-white text-primary rounded-lg py-3 px-6 font-poppins text-lg hover:bg-gray-100 transition"
          >
            Soal Quiz HTML
          </Link>
          <Link
            to="/quiz-listcss"
            className="bg-white text-primary rounded-lg py-3 px-6 font-poppins text-lg hover:bg-gray-100 transition"
          >
            Soal Quiz CSS
          </Link>
          <Link
            to="/quiz-edit"
            className="bg-white text-primary rounded-lg py-3 px-6 font-poppins text-lg hover:bg-gray-100 transition"
          >
            Edit Quiz
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default QuizPage;
