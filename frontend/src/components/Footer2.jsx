import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full px-5 mx-auto mt-16 md:mt-24 max-w-7xl md:px-0 bg-background ">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between">
          {/* Logo and Description */}
          <div className="w-[380px] mb-6 md:mb-0">
            <div className="flex items-center mb-7">
              <Image
                src="/logo.png"
                alt="Quizu Logo"
                width={150}
                height={75}
                className="md:w-[198px] md:h-[79px]"
              />
            </div>
            <p className="text-[#0E0F0F] text-sm md:text-base">
              Explore, learn, and challenge yourself with our interactive exams.
              Expand your knowledge and track your progress effortlessly.
            </p>
            <div className="flex mt-6 gap-14 md:gap-6">
              <Link href="https://www.facebook.com" aria-label="Facebook">
                <FaFacebook
                  className="text-[#0E0F0F] hover:text-gray-700 duration-300 ease-in"
                  size={24}
                />
              </Link>
              <Link href="https://www.instagram.com" aria-label="Instagram">
                <FaInstagram
                  className="text-[#0E0F0F] hover:text-gray-700 duration-300 ease-in"
                  size={24}
                />
              </Link>
              <Link href="https://www.youtube.com" aria-label="YouTube">
                <FaYoutube
                  className="text-[#0E0F0F] hover:text-gray-700 duration-300 ease-in"
                  size={24}
                />
              </Link>
              <Link href="https://www.twitter.com" aria-label="Twitter">
                <FaTwitter
                  className="text-[#0E0F0F] hover:text-gray-700 duration-300 ease-in"
                  size={24}
                />
              </Link>
            </div>
          </div>

          {/* Links Section */}
          <div className="flex flex-wrap mt-4 md:gap-32">
            {/* About Section */}
            <div className="w-1/2 mb-6 tracking-wider lg:w-auto md:mb-0">
              <h2 className="mb-4 text-lg font-bold">About</h2>
              <ul className="space-y-4 text-[#0E0F0F]">
                <li className="">
                  <Link href="/">Home</Link>
                </li>
                <li className="">
                  <Link href="/about">About</Link>
                </li>
                <li className="">
                  <Link href="/news">News & Blogs</Link>
                </li>
                <li>
                  <Link href="/help-and-support">Help & Supports</Link>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div className="w-1/2 mb-6 lg:w-auto md:mb-0">
              <h2 className="mb-4 text-lg font-bold">Company</h2>
              <ul className="space-y-4 text-[#0E0F0F]">
                <li className="">
                  <Link href="how-we-work">How we work</Link>
                </li>
                <li className="">
                  <Link href="terms-of-service">Terms of service</Link>
                </li>
                <li>
                  <Link href="faq">FAQ</Link>
                </li>
              </ul>
            </div>

            {/* Contact Us Section */}
            <div className="w-full lg:w-auto">
              <h2 className="mb-4 text-lg font-bold">Contact Us</h2>
              <ul className="space-y-4  text-[#0E0F0F] ">
                <li className="">Kathmandu, Nepal</li>
                <li className="">+977 9812345678</li>
                <li className="cursor-pointer">connect@quizkoshi.com.np</li>
                <li className="cursor-pointer">quizkoshi.com.np</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Footer Bottom */}
      </div>
      <div className="mt-8 text-center text-gray-700">
        © 2024 QuizKoshi. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
