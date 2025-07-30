import { useAuth } from "@/context/userContext";
import Image from "next/image";
import Link from "next/link";
const HomepageBeforeLogin = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className="w-full px-5 mx-auto max-w-7xl md:px-0">
      {/* hero div */}
      <div className="flex flex-col md:flex-row">
        {/* left */}
        <div className="">
          <h1 className=" mt-12 md:mt-28 text-4xl md:text-6xl font-bold text-[#072942] leading-tight ">
            Learn <br /> new concepts <br /> each minute
          </h1>
          <p className=" text-lg md:text-xl italic font-bold mt-11 border-l-[3px] pl-3 border-primary">
            Master engineering and medical entrance <br /> exams, and excel in
            Korean language <br /> proficiency with our comprehensive MCQ <br />
            platform.
          </p>
          {/* button  */}
          <div className="flex items-center mt-12 gap-14">
            <Link
              href="/login"
              className="px-6 py-4 text-white font-bold md:text-xl tracking-wide bg-gradient-to-r from-[#122738] to-[#00A778] hover:bg-gradient-to-l  duration-300"
            >
              Start solving
            </Link>
            <Link href="/about" className="font-bold text-[#122738] md:text-xl">
              know more
            </Link>
          </div>
        </div>
        {/* right */}
        <div className="relative mt-8 md:mt-0">
          <Image
            src="/home/illustrator.png"
            alt="illustrator"
            width={642}
            height={602}
          />
          <Image
            src="/home/hero.png"
            alt="hero-img"
            width={614}
            height={413}
            className="absolute top-6 md:top-32 md:left-36"
          />
        </div>
      </div>
      {/* middle div */}
      <div className="relative mt-12 md:mt-20 ">
        <h1 className=" text-4xl md:text-6xl font-bold text-center text-[#122738]">
          Welcome to QuizKoshi
        </h1>
        <h2 className=" mt-8 md:mt-16 text-center text-3xl md:text-5xl text-[#230D00]">
          Our Key Features
        </h2>
        <Image
          src="/home/illustrator2.png"
          alt="line-1"
          width={314}
          height={80}
          className="absolute hidden overflow-visible md:inline -top-28 -left-32"
        />
        <Image
          src="/home/illustrator3.png"
          alt="line-2"
          width={260}
          height={80}
          className="absolute hidden overflow-visible md:inline -top-28 -right-28"
        />
        <Image
          src="/home/illustrator4.png"
          alt="line-2"
          width={219}
          height={46}
          className="absolute hidden overflow-visible md:inline -bottom-56 -right-32"
        />

        <div className="flex flex-col gap-8 mt-16 md:gap-16 md:mt-32 md:flex-row">
          <div className="w-4/5 mx-auto">
            <Image
              src="/home/icon1.svg"
              alt="icon-1"
              width={106}
              height={106}
              className="mx-auto"
            />
            <h1 className="text-[#072942] font-bold text-lg md:text-2xl md:mt-4 tracking-wider ">
              Extensive MCQ Repository
            </h1>
            <p className="text-[#230D00] md:text-xl mt-4 text-justify">
              Access thousands of expertly curated questions covering all
              essential topics.
            </p>
          </div>
          <div className="w-4/5 mx-auto">
            <Image
              src="/home/icon2.svg"
              alt="icon-1"
              width={106}
              height={106}
              className="mx-auto"
            />
            <h1 className="text-[#072942] font-bold text-lg md:text-2xl md:mt-4  tracking-wider">
              Personalized Learning
            </h1>
            <p className="text-[#230D00] md:text-xl mt-4 text-justify">
              Benefit from adaptive learning algorithms that tailor quizzes to
              your strengths and weaknesses.
            </p>
          </div>
          <div className="w-4/5 mx-auto">
            <Image
              src="/home/icon3.svg"
              alt="icon-1"
              width={106}
              height={106}
              className="mx-auto"
            />
            <p className="text-[#072942] font-bold text-lg md:text-2xl md:mt-4 tracking-wider">
              Real-time Analytics
            </p>
            <p className="text-[#230D00] md:text-xl mt-4 text-justify ">
              Track your progress and identify areas for improvement with our
              detailed analytics.
            </p>
          </div>
        </div>
      </div>
      {/* bottom div */}
      <div className="mt-16 md:mt-40">
        <h1 className=" text-3xl md:text-5xl font-bold text-[#122738] tracking-wide w-full">
          Let’ checkout your <span className="text-primary">learning </span>
          journey
        </h1>
        {/* content */}
        <div className="mt-12 space-y-6 md:mt-32">
          <div className="flex items-center md:gap-72 ">
            <div className="space-y-2 md:w-1/2 ">
              <h1 className="text-xl font-bold md:text-3xl text-brown ">
                1. Sign Up and Create Your Profile
              </h1>
              <p className="text-[#122738] text-sm md:text-base">
                Get started by creating a personalized profile to track your
                progress and customize your learning experience.
              </p>
            </div>
            <Image
              src="/home/icon4.png"
              alt="icon-4"
              width={80}
              height={73}
              className="md:w-[127px]"
            />
          </div>
          <div className="flex items-center md:justify-between ">
            <div className="space-y-2 md:w-1/2 ">
              <h1 className="mt-4 text-xl font-bold md:text-3xl text-brown">
                2. Choose Your Exam or Language Goal
              </h1>
              <p className="text-[#122738] mt-4 text-sm md:text-base">
                Select the specific exam or language proficiency goal you are
                preparing for.
              </p>
            </div>
            <Image
              src="/home/icon5.png"
              alt="icon-4"
              width={80}
              height={73}
              className="md:w-[127px]  "
            />
          </div>
          <div className="flex items-center md:gap-72 ">
            <div className="space-y-2 md:w-1/2">
              <h1 className="text-xl font-bold md:text-3xl text-brown ">
                3. Take Diagnostic Quizzes
              </h1>
              <p className="text-[#122738] mt-4 text-sm md:text-base">
                Complete initial quizzes to identify your strengths and areas
                for improvement.
              </p>
            </div>
            <Image
              src="/home/icon6.png"
              alt="icon-4"
              width={80}
              height={73}
              className="md:w-[127px] "
            />
          </div>
          <div className="flex items-center md:justify-between ">
            <div className="space-y-2 md:w-1/2">
              <h1 className="text-xl font-bold md:text-3xl text-brown ">
                4. Track Your Progress and Achieve Your Goal
              </h1>
              <p className="text-[#122738] mt-4 text-sm md:text-base">
                Monitor your improvement with real-time analytics and detailed
                performance reports to ensure you reach your academic and
                language learning goals.
              </p>
            </div>
            <Image
              src="/home/icon7.png"
              alt="icon-4"
              width={70}
              height={73}
              className="md:w-[110px] "
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomepageBeforeLogin;
