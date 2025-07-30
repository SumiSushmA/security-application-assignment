import React from "react";
import Image from "next/image";

const CheckAnswerCard = ({ question, questionIndex }) => {
  const getRadioStyle = (option) => {
    if (option === question.correct_option) {
      return "accent-lime-600"; // Green for correct option
    }
    if (option === question.selectedOption) {
      return "accent-[#C40031]"; // Red for incorrect selected option
    }
    return "";
  };

  const isOptionChecked = (option) => {
    return (
      option === question.selectedOption || option === question.correct_option
    );
  };

  return (
    <div className="pl-6 pt-7">
      <h1 className="text-[#0E0F0F] text-xl md:text-2xl font-bold">
        {questionIndex + 1}. {question?.questionTitle}
      </h1>
      {question?.image && (
        <Image
          src={question.image}
          width={224}
          height={129}
          alt="question image"
          className="w-[224px] h-[129px] object-contain rounded-xl mt-7"
        />
      )}

      {/* options */}
      <div className="grid mt-6 place-self-center grid-1 md:grid-cols-2 gap-y-8">
        {question?.options?.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`option${index}`}
              value={option}
              checked={isOptionChecked(option)}
              className={`scale-150 ${getRadioStyle(option)}`}
              readOnly
            />
            <label
              htmlFor={`option${index}`}
              className="text-[#0E0F0F] text-lg">
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckAnswerCard;
