import React from "react";

const FAQ = () => {
  return (
    <div className="w-full px-5  mx-auto max-w-[1140px] md:px-0 ">
      <div className="h-full px-8 pb-10 mt-10 bg-white rounded-xl">
        <h1 className="pt-6 text-2xl font-bold md:text-4xl text-brown">
          {" "}
          Frequently Asked <span className="text-[#C40031]">Questions</span>
        </h1>

        <p className="md:text-lg text-[#0E0F0F] mt-6">
          Our FAQ section addresses the most common queries we receive from
          QuizKoshi users. Find quick answers to streamline your learning
          experience.
        </p>

        {/* content */}
        <div className="mt-10 space-y-12 md:space-y-8 text-[#0E0F0F]">
          <div>
            <h2 className="text-lg font-semibold md:text-xl">
              How do I reset my password?
            </h2>
            <p className="mt-2">
              You can reset your password by clicking on &apos;Forgot
              Password&apos; at the login screen. Follow the prompts to receive
              an email link for resetting your password.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold md:text-xl">
              Can I access QuizKoshi on multiple devices?
            </h2>
            <p className="mt-2">
              Yes, you can access QuizKoshi on multiple devices. Simply log in with
              your credentials on any supported device to continue your learning
              seamlessly.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold md:text-xl">
              What should I do if a quiz isn&apos;t loading properly?
            </h2>
            <p className="mt-2">
              Ensure that your internet connection is stable. If the problem
              persists, try refreshing the page or restarting your browser. If
              none of these steps work, contact our support team for help
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold md:text-xl">
              How can I track my progress on QuizKoshi?
            </h2>
            <p className="mt-2">
              QuizKoshi offers a comprehensive dashboard that tracks your progress.
              You can view detailed statistics about your performance in various
              quizzes and subjects through your user profile.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold md:text-xl">
              Are there any community guidelines for QuizKoshi users?
            </h2>
            <p className="mt-2">
              Yes, we have a set of community guidelines designed to ensure a
              respectful and productive environment for all users. These include
              norms around respectful communication, privacy, and intellectual
              honesty. You can view these guidelines in full on our
              &apos;Community Guidelines&apos; page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
