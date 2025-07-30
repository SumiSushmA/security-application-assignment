import Image from "next/image";
import Link from "next/link";
const About = () => {
  return (
    <div className="w-full px-5 mx-auto max-w-7xl md:px-0">
      {/* hero div */}
      <div className="flex flex-col md:flex-row ">
        {/* left div */}
        <div className="flex-1 mt-12 md:mt-32">
          <h1 className="text-[#333333] pl-5 text-4xl md:text-6xl border-l-2 border-primary">
            About QuizKoshi
          </h1>
          <p className="text-[#828282] font-bold text-lg md:text-2xl mt-10">
            QuizKoshi was born out of a passion for education and a desire to bridge
            the gaps in existing learning platforms. We recognized that students
            needed a more comprehensive, user-friendly, and adaptive tool to
            prepare for their exams and language proficiency tests. Thus, QuizKoshi
            was created to offer a dynamic learning experience that combines
            extensive question banks, personalized recommendations, and
            real-time performance analytics.
          </p>
          <div className="flex items-center mt-12 gap-14">
            <Link
              href="/"
              className="px-6 py-4 text-white font-bold md:text-xl tracking-wide  bg-[#122738] hover:bg-[#081d2e] duration-300">
              Start solving
            </Link>
            <Link
              href="/help-and-support"
              className="font-bold text-[#2E80FF] hover:text-[#176dea] duration-300 md:text-xl">
              Need help?
            </Link>
          </div>
        </div>
        {/* right div with image */}
        <div className="flex-1">
          <Image
            src="/about/hero-img.png"
            alt="hero-image"
            width={694}
            height={702}
          />
        </div>
      </div>
      {/* mid div */}
      <div className="mt-8 md:mt-40">
        <h1 className="text-[#333333] text-4xl md:text-6xl text-center">
          Why QuizKoshi?
        </h1>
        {/* content */}
        <div className="flex flex-col items-center w-4/5 gap-12 mx-auto mt-20 md:gap-32 md:flex-row md:w-full ">
          <div className="space-y-2 text-center md:space-y-4">
            <Image
              src="/about/icon1.svg"
              alt="alt image"
              width={100}
              height={100}
              className="mx-auto md:w-[140px]  "
            />
            <h1 className="text-[#333333] text-2xl md:text-4xl ">MISSION</h1>
            <p className="text-[#828282] text-xl md:text-2xl  ">
              Dimensional coverage of all questions related to a particular
              topic Dimensional coverage of all questions related
            </p>
          </div>
          <div className="space-y-2 text-center md:space-y-4">
            <Image
              src="/about/icon2.svg"
              width={100}
              height={100}
              alt="icon"
              className="mx-auto md:w-[140px]"
            />
            <h1 className="text-[#333333] text-2xl md:text-4xl ">VISION</h1>
            <p className="text-[#828282] text-xl md:text-2xl">
              Plenty of subjects to choose from for e.g. Computer languages,
              Engineering subjects etc.
            </p>
          </div>
          <div className="space-y-2 text-center md:space-y-4">
            <Image
              src="/about/icon3.svg"
              width={100}
              height={100}
              alt="icon"
              className="mx-auto md:w-[140px]"
            />
            <h1 className="text-[#333333] text-2xl md:text-4xl ">GOAL</h1>
            <p className="text-[#828282] text-xl md:text-2xl">
              Detailed explanation of a solution is provided to get deeper
              understanding of a topic
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
