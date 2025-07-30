/* eslint-disable react/jsx-key */
"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const QuestionCard = ({ question, questionIndex, onOptionSelect }) => {
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    setSelectedOption(question.selectedOption || "");
  }, [question]);

  const handleOptionChange = (e) => {
    const option = e.target.value;
    setSelectedOption(option);
    onOptionSelect(question._id, option);
    // console.log(question._id, option);
  };

  return (
    <div className="pl-6 pt-7">
      <h1 className="text-[#0E0F0F] text-xl md:text-2xl pr-2 font-bold">
        {questionIndex + 1}. {question?.questionTitle}
      </h1>
      {question?.coverImage && (
        <Image
          src={question.coverImage}
          width={224}
          height={129}
          alt="question image"
          className="w-[224px] h-[129px] object-contain rounded-xl mt-7"
        />
      )}

      {/* options */}
      <form className="mt-6">
        <div className="grid place-self-center grid-1 md:grid-cols-2 gap-y-8">
          {question?.options?.map((option, index) => (
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id={`option${index}`}
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
                className="accent-[#063173] scale-150"
              />
              <label
                htmlFor={`option${index}`}
                className="text-[#0E0F0F] text-lg"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default QuestionCard;
