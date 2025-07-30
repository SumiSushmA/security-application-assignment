"use client";
import Link from "next/link";
import ApiRequest from "@/utils/apiRequest";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";

const Result = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    notAnswered: 0,
    timeTaken: 0,
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
          timeTaken: scoreData.timeTaken,
          quiz: {
            quizId: scoreData.quiz._id,
            title: scoreData.quiz.title,
            category: {
              name: scoreData.quiz?.category?.name,
            },
            questions: scoreData.quiz.questions,
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
  const formatTime = (seconds) => {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    secs = String(secs).padStart(2, "0");

    return `${hours}:${minutes}:${secs}`;
  };

  return (
    <div className="w-full h-full md:h-[736px] max-w-6xl px-5 mx-auto my-10 md:px-0">
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
          <div className="bg-[#F7F7F7] md:h-[90vh] mt-10 md:mt-20 border-2 border-[#BBD6FF] rounded-xl flex flex-col md:flex-row">
            {/* left div */}
            <div className="w-[265px] h-full md:border-r-2 border-[#BBD6FF] pt-6 pl-6">
              <h1 className="text-[#0E0F0F] font-bold text-2xl">Your Result</h1>
              <p className="text-[#C40031] font-bold text-4xl mt-8">
                {result?.score}/{result?.quiz?.questions?.length}
              </p>

              <div className="mt-12 space-y-7">
                <p className="text-lg">
                  Score: <span className="font-bold">{result?.score}</span>
                </p>
                <p className="text-lg">
                  Accuracy:{" "}
                  <span className="font-bold">
                    {(
                      (result?.score / result?.quiz?.questions?.length) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </p>
                <p className="text-lg">
                  Time taken:{" "}
                  <span className="font-bold">
                    {formatTime(result?.timeTaken)}
                  </span>
                </p>
              </div>
            </div>
            {/* right div */}
            <div className="md:flex-1">
              <h1 className="text-[#063173] font-bold text-center text-2xl mt-6 md:mt-0 py-7 border-b-2 border-[#BBD6FF]">
                Test Completed
              </h1>
              <div className="p-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#0E0F0F]">
                  {result?.quiz?.title} test question
                </h2>

                <div className="flex flex-col gap-8 mt-8 md:flex-row">
                  <div className="flex items-center gap-1">
                    <span className="text-white bg-[#7AC400] py-1 px-3 rounded-lg">
                      {result.correctAnswers}
                    </span>
                    <span className="text-lg">Correct</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-white bg-[#C40031] py-1 px-3 rounded-lg">
                      {result.wrongAnswers}
                    </span>
                    <span className="text-lg">Wrong</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-white bg-[#585858] py-1 px-3 rounded-lg">
                      {result.notAnswered}
                    </span>
                    <span className="text-lg">Not Answered</span>
                  </div>
                </div>
                {/* result */}
                <h1 className="mt-10 text-2xl font-bold">Result</h1>
                <div className="flex gap-4 mt-7">
                  <span className="text-white bg-[#7AC400] py-1 px-3 rounded-lg">
                    {result.correctAnswers}
                  </span>
                  <span className="text-white bg-[#C40031] py-1 px-3 rounded-lg">
                    {result.wrongAnswers}
                  </span>
                  <span className="text-white bg-[#585858] py-1 px-3 rounded-lg">
                    {result.notAnswered}
                  </span>
                </div>
                {/* buttons */}
                <div className="flex flex-col gap-3 mt-12 md:space-x-6 md:block">
                  <Link
                    href={`/exam/check-answer/${id}`}
                    className="text-white bg-[#063173] border-2 border-[#063173] w-2/3 text-center py-3 px-6 rounded-xl"
                  >
                    Check Answer
                  </Link>
                  <Link
                    href={`/exam/${result?.quiz?.quizId}`}
                    className="text-[#063173] bg-[#f7f7f7] border-2 border-[#063173] text-center py-3 w-2/3 px-6 rounded-xl"
                  >
                    Try Again
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Result;
