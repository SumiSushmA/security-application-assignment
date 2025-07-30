import React from "react";

const page = () => {
  return (
    <div className="w-full px-5  mx-auto max-w-[1140px] md:px-0 ">
      <div className="h-full px-8 pb-10 mt-10 bg-white rounded-xl">
        <h1 className="pt-6 text-2xl font-bold md:text-4xl text-brown">
          Help and <span className="text-[#C40031]">Support</span>
        </h1>
        {/* welcome message */}
        <div>
          <h2 className="mt-10 text-xl md:text-2xl font-bold text-[#0E0F0F]">
            Welcome to the QuizKoshi Help Center
          </h2>
          <p className="md:text-lg text-[#0E0F0F] mt-5">
            Whether you&apos;re just getting started or looking to deepen your
            knowledge with QuizKoshi, our Help and Support Center is dedicated to
            ensuring a smooth and productive learning experience. Here, you can
            access a wide range of resources designed to answer your questions,
            guide you through features, and help resolve any issues you may
            encounter.
          </p>
        </div>
        {/* content */}
        <div className="mt-8 space-y-12 md:space-y-8 text-[#0E0F0F]">
          {/* contact us */}
          <div>
            <h3 className="text-lg font-semibold md:text-xl ">Contact Us</h3>
            <ul className="mt-4 space-y-6 md:space-y-2">
              <li>
                <span className="font-semibold">Live Support: </span>
                Connect directly with our support team during business hours for
                immediate assistance.
              </li>
              <li>
                <span className="font-semibold">Email Us: </span> For less
                urgent inquiries or detailed assistance, please send us an email
                at{" "}
                <a
                  href="mailto: support@quizkoshi.com"
                  className="font-semibold text-blue-600 ">
                  support@quizkoshi.com
                </a>{" "}
                . We aim to respond within 24 hours.
              </li>
              <li>
                <span className="font-semibold">Social Media: </span> Reach out
                to us on our social media platforms for quick queries and
                updates. Follow us on Twitter, Facebook, and Instagram at{" "}
                <span className="font-semibold text-blue-600">
                  @QuizKoshiSupport.
                </span>
              </li>
            </ul>
          </div>
          {/* trouble shooting */}
          <div>
            <h3 className="text-lg font-semibold md:text-xl ">
              Troubleshooting
            </h3>
            <p className="mt-2">
              Access step-by-step guides to solve common technical and usage
              issues, from login troubles to quiz functionality glitches.
            </p>
          </div>
          {/* technical support */}
          <div>
            <h3 className="text-lg font-semibold md:text-xl ">
              Technical Support
            </h3>
            <p className="mt-2">
              Explore detailed articles and guides on how to maximize your use
              of QuizKoshi, including device compatibility, system requirements, and
              advanced features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
