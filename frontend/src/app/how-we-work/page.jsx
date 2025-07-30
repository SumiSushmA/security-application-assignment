import React from "react";

const page = () => {
  return (
    <div className="w-full px-5  mx-auto max-w-[1140px] md:px-0 ">
      <div className="h-full px-8 pb-10 mt-10 bg-white rounded-xl">
        <h1 className="pt-6 text-2xl font-bold md:text-4xl text-brown">
          {" "}
          How We <span className="text-[#C40031]">Work</span>
        </h1>
        {/* our approach  */}
        <div>
          <h2 className="mt-10 text-xl md:text-2xl font-bold text-[#0E0F0F]">
            Our Approach to Learning
          </h2>
          <p className="md:text-lg text-[#0E0F0F] mt-5">
            At QuizKoshi, we believe in making learning personalized, accessible,
            and engaging. Here’s how we make it happen.
          </p>
        </div>
        {/* content */}
        <div className="mt-8 space-y-12 md:space-y-8 text-[#0E0F0F]">
          {/* Personalized learning path */}
          <div>
            <h3 className="text-lg font-semibold md:text-xl ">
              Personalized Learning Paths
            </h3>
            <p className="mt-2">
              Every learner is unique. Our adaptive technology tailors quizzes
              and content based on your individual strengths and areas for
              improvement.
            </p>
          </div>
          {/* Real time feedback */}
          <div>
            <h3 className="text-lg font-semibold md:text-xl ">
              Real-Time Feedback
            </h3>
            <p className="mt-2">
              Get instant feedback on your quizzes, helping you understand what
              you know and what you need to review.
            </p>
          </div>
          {/* Collaborative learning */}
          <div>
            <h3 className="text-lg font-semibold md:text-xl ">
              Collaborative Learning
            </h3>
            <p className="mt-2">
              Join study groups, participate in discussions, and connect with
              peers and educators from around the world.
            </p>
          </div>
          {/*  continuous improvement */}
          <div>
            <h3 className="text-lg font-semibold md:text-xl ">
              Continuous Improvement
            </h3>
            <p className="mt-2">
              We regularly update our content and platform features based on
              user feedback and the latest educational research.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
