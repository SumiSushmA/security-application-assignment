import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-background py-16">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Quizu Logo" width={198} height={79} />
        </div>
        <div className="flex space-x-8">
          <Link href="https://www.facebook.com" aria-label="Facebook">
            <FaFacebook className="text-black hover:text-gray-500" size={30} />
          </Link>
          <Link href="https://www.instagram.com" aria-label="Instagram">
            <FaInstagram className="text-black hover:text-gray-500" size={30} />
          </Link>
          <Link href="https://www.youtube.com" aria-label="YouTube">
            <FaYoutube className="text-black hover:text-gray-500" size={30} />
          </Link>
          <Link href="https://www.twitter.com" aria-label="Twitter">
            <FaTwitter className="text-black hover:text-gray-500" size={30} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
