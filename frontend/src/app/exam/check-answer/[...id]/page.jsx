"use client";
import ApiRequest from "@/utils/apiRequest";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import Link from "next/link";
import PropagateLoader from "react-spinners/PropagateLoader";

import CheckAnswerCard from "@/components/CheckAnswerCard";

const CheckAnswer = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    notAnswered: 0,
    quiz: {
      quizId: "",
      title: "",
      category: { name: "" },
      questions: [],
    },
  });

  // console.log(result);
  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await ApiRequest.get(`/score/${id}`);
        const scoreData = res.data?.data?.score;
        // console.log("scoreData", scoreData);

        setResult({
          score: scoreData.score,
          correctAnswers: scoreData.correctAnswers,
          wrongAnswers: scoreData.wrongAnswers,
          notAnswered: scoreData.notAnswered,
          quiz: {
            quizId: scoreData.quiz._id,
            title: scoreData.quiz.title,
            category: {
              name: scoreData.quiz?.category?.name,
            },
            questions: scoreData.quiz.questions.map((question, index) => ({
              ...question,
              selectedOption: scoreData.selected_options[index]?.option || "",
              isCorrect:
                scoreData.selected_options[index]?.option ===
                question.correct_option,
              isAttempted: scoreData.selected_options[index]?.option !== "",
            })),
          },
        });
        setLoading(false);
      } catch (error) {
        console.log("Error fetching result:", error);
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  const handleNextQuestion = () => {
    if (currentQuestionIndex < result?.quiz?.questions?.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleQuestionButtonClick = (index) => {
    setCurrentQuestionIndex(index);
  };
  const currentQuestion = result?.quiz?.questions?.[currentQuestionIndex];

  return (
    <div className="w-full h-full md:h-[800px] max-w-6xl px-5 mx-auto my-10 md:px-0">
      {loading ? (
        <div className="flex items-center justify-center h-[50%]">
          <PropagateLoader color="#0eb1a6" loading={loading} size={20} />
        </div>
      ) : (
        <>
          <h1 className="mt-12 text-[#0E0F0F] text-3xl md:text-5xl font-bold">
            {result?.quiz?.category?.name}
            <span className="text-[#C40031]"> {result?.quiz?.title}</span>
          </h1>
          {/* container */}
          <div className="bg-[#F7F7F7] md:h-[736px] mt-10 md:mt-20 border-2 border-[#BBD6FF] rounded-xl flex flex-col md:flex-row">
            {/* left div */}
            <div className="w-[265px] h-full md:border-r-2 border-[#BBD6FF] pt-6 pl-6 mx-auto">
              <h1 className="text-[#0E0F0F] font-bold text-2xl">
                Check Answers
              </h1>
              <div className="w-4/5 h-full md:h-[80%] mx-auto mt-20 flex flex-col justify-between ">
                {/* question numbers */}
                <div className="flex flex-wrap gap-3 overflow-y-auto">
                  {result?.quiz?.questions?.map((question, index) => (
                    <button
                      key={index}
                      className={` w-8 h-8 rounded-xl
                  ${
                    question.isCorrect
                      ? "bg-[#7AC400] border-2 border-[#7AC400] text-white"
                      : !question.isAttempted
                      ? " border-2 text-[#063173] border-[#063173] "
                      : "border-2  bg-[#C40031] text-white border-[#C40031]"
                  }`}
                      onClick={() => handleQuestionButtonClick(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                {/* legend */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1.5 rounded-xl bg-[#7AC400]  border-2 border-[#7AC400] text-white">
                      A
                    </span>
                    <span className="text-[#0E0F0F] text-base font-medium">
                      Correct
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1.5 rounded-xl bg-[#C40031]  border-2 border-[#C40031] text-white">
                      B
                    </span>
                    <span className="text-[#0E0F0F] text-base font-medium">
                      Wrong
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1.5 rounded-xl border-2 text-[#063173] border-[#063173]">
                      C
                    </span>
                    <span className="text-[#0E0F0F] text-base font-medium">
                      Unattempted
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* right div */}
            <div className="md:flex-1">
              <h1 className="text-[#063173] font-bold text-center text-2xl mt-6 md:mt-0 py-7 border-b-2 border-[#BBD6FF]">
                Question {currentQuestionIndex + 1}
              </h1>
              {/* Question card */}
              {currentQuestion && (
                <CheckAnswerCard
                  question={currentQuestion}
                  questionIndex={currentQuestionIndex}
                />
              )}

              {/* previous and next button */}
              <div className="flex items-center gap-5 mt-16 pl-7">
                <button
                  className="flex items-center gap-2"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <MdSkipPrevious size={20} />
                  <span className="text-[#0E0F0F] text-lg">Previous</span>
                </button>
                <button
                  className="flex items-center gap-2"
                  onClick={handleNextQuestion}
                  disabled={
                    currentQuestionIndex === result?.quiz?.questions?.length - 1
                  }
                >
                  <span className="text-[#0E0F0F] text-lg">Next</span>
                  <MdSkipNext size={20} />
                </button>
              </div>
              {/* buttons */}
              <div className="flex flex-col gap-3 pb-8 pl-6 mt-12 md:block md:space-x-6">
                <Link
                  href="/"
                  className="text-white bg-[#063173] w-2/3 text-center border-2 border-[#063173] py-3 px-6 rounded-xl"
                >
                  Return Home
                </Link>
                <Link
                  href={`/exam/${result?.quiz?.quizId}`}
                  className="text-[#063173] bg-[#f7f7f7] w-2/3 text-center border-2 border-[#063173] py-3 px-6 rounded-xl"
                >
                  Try Again
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckAnswer;
