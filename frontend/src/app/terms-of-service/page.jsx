import React from "react";

const page = () => {
  return (
    <div className="w-full px-5  mx-auto max-w-[1140px] md:px-0 ">
      <div className="h-full px-8 pb-10 mt-10 bg-white rounded-xl">
        <h1 className="pt-6 text-2xl font-bold md:text-4xl text-brown">
          Terms of <span className="text-[#C40031]"> Service</span>
        </h1>
        {/* welcome message */}
        <div>
          <h2 className="mt-10 text-xl md:text-2xl font-bold text-[#0E0F0F]">
            Welcome to the QuizKoshi Help Center
          </h2>
          <p className="md:text-lg text-[#0E0F0F] mt-5">
            These Terms of Service govern your use of QuizKoshi and provide
            information about the QuizKoshi service outlined below. By creating an
            account or using QuizKoshi, you agree to these terms.
          </p>
        </div>
        {/* content */}
        <div className="mt-8 space-y-12 md:space-y-8 text-[#0E0F0F]">
          {/* User Agreement */}
          <div>
            <h3 className="text-lg font-semibold md:text-xl ">
              User Agreement
            </h3>
            <ul className="mt-4 space-y-6 md:space-y-2">
              <li>
                <span className="font-semibold">Eligibility: </span>
                You must be at least 13 years old to use QuizKoshi.
              </li>
              <li>
                <span className="font-semibold">Account Use: </span> Users are
                responsible for all activities that occur under their account.
              </li>
              <li>
                <span className="font-semibold">Content: </span> All content
                provided on QuizKoshi is for personal use only and may not be
                copied, distributed, or used in any other manner.
              </li>
            </ul>
          </div>
          {/* Intellectual Property */}
          <div>
            <h3 className="text-lg font-semibold md:text-xl ">
              Intellectual Property
            </h3>
            <p className="mt-2">
              All content on QuizKoshi, including text, graphics, logos, and
              software, is the property of QuizKoshi or its content suppliers and
              protected by international copyright laws.
            </p>
          </div>
          {/* Termination */}
          <div>
            <h3 className="text-lg font-semibold md:text-xl ">Termination</h3>
            <p className="mt-2">
              QuizKoshi reserves the right to terminate your access to the platform
              if you fail to comply with these terms.
            </p>
          </div>
          {/* Disclaimer */}
          <div>
            <h3 className="text-lg font-semibold md:text-xl ">Disclaimer</h3>
            <p className="mt-2">
              QuizKoshi is provided &quot;as is&quot; without any warranties,
              express or implied. We do not guarantee that the services will
              meet your specific requirements or be available uninterrupted.
            </p>
            <p className="mt-2">
              QuizKoshi team can use your information for further research and
              marketing purposes.
            </p>
          </div>
          {/*  governing law */}
          <div>
            <h3 className="text-lg font-semibold md:text-xl ">Governing Law</h3>
            <p className="mt-2">
              These terms are governed by the laws of [Jurisdiction], without
              regard to its conflict of law provisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
