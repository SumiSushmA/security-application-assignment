"use client";

import ExamSetCard from "./ExamSetCard";

import Carousel from "react-multi-carousel";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const ExamCategoryComoponent = ({ category }) => {
  return (
    <div>
      <h1 className="text-[#0E0F0F] font-bold italic text-3xl md:text-5xl">
        {category.name}
      </h1>
      {/* sets */}
      <Carousel
        responsive={responsive}
        removeArrowOnDeviceType={["medium", "small"]}
        className="mt-16 ">
        {/* set card */}
        {category?.quizzes?.map((quiz, index) => {
          return <ExamSetCard key={index} quiz={quiz} />;
        })}
      </Carousel>
    </div>
  );
};
export default ExamCategoryComoponent;
