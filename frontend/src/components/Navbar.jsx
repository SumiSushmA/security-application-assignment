// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { FaBars, FaTimes } from "react-icons/fa";
// import { useAuth } from "@/context/userContext";
// import ApiRequest from "@/utils/apiRequest";
// import { useRouter } from "next/navigation";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { IoMdLogOut } from "react-icons/io";
// import { toast } from "react-toastify";

// const Navbar = () => {
//   const { isAuthenticated, setIsAuthenticated, user, setUser } = useAuth();
//   const router = useRouter();

//   const [show, setShow] = useState(false);
//   const [dropdown, setDropdown] = useState(false);
//   const [activeLink, setActiveLink] = useState("/");

//   const toggleHamburger = () => setShow(!show);

//   const handleLogout = async () => {
//     try {
//       const res = await ApiRequest.get("/user/logout");

//       toast.success(res.data.messsage);
//       localStorage.removeItem("token");
//       setIsAuthenticated(false);
//       setUser({});
//       router.push("/");
//     } catch (error) {
//       setUser({});
//       toast.error(error?.response?.data?.message);
//       setIsAuthenticated(false);
//     }
//   };

//   const toggleDropdown = () => setDropdown(!dropdown);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(".dropdown-content")) {
//         if (dropdown) {
//           setDropdown(false);
//         }
//       }
//     };

//     if (dropdown) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [dropdown]);

//   const handleLinkClick = (path) => {
//     setActiveLink(path);
//   };

//   return (
//     <div className="flex items-center justify-between w-full px-4 pt-10 mx-auto text-black md:px-0 max-w-7xl">
//       {/* logo */}
//       <Link href="/">
//         <Image
//           src="/logo.png"
//           width={158}
//           height={79}
//           alt=""
//           className="z-20"
//         />
//       </Link>
//       {/* hamburgerIcon */}
//       <button onClick={toggleHamburger} className="z-50 text-2xl md:hidden">
//         {show ? <FaTimes /> : <FaBars />}
//       </button>
//       {/* mobile screen */}
//       {show && (
//         <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-white md:hidden">
//           <ul className="flex flex-col items-center gap-8 text-xl">
//             <li>
//               <Link href="/" onClick={toggleHamburger}>
//                 Home
//               </Link>
//             </li>
//             <li>
//               <Link href="/about" onClick={toggleHamburger}>
//                 About us
//               </Link>
//             </li>
//             <li>
//               <Link href="/books" onClick={toggleHamburger}>
//                 Books
//               </Link>
//             </li>
//             <li>
//               <Link href="/news" onClick={toggleHamburger}>
//                 News
//               </Link>
//             </li>

//             {isAuthenticated ? (
//               <li>
//                 <Link href="/profile" onClick={toggleHamburger}>
//                   Profile
//                 </Link>
//               </li>
//             ) : (
//               <li>
//                 <Link href="/signup" onClick={toggleHamburger}>
//                   Register
//                 </Link>
//               </li>
//             )}

//             {isAuthenticated ? (
//               <button
//                 onClick={() => {
//                   handleLogout();
//                   toggleHamburger();
//                 }}
//                 className="text-primary"
//               >
//                 Logout
//               </button>
//             ) : (
//               <li>
//                 <Link href="/login" onClick={toggleHamburger}>
//                   <button className="px-8 py-3 text-2xl font-bold text-primary border-[2px] border-primary hover:bg-primary hover:text-white duration-300">
//                     Login
//                   </button>
//                 </Link>
//               </li>
//             )}
//           </ul>
//         </div>
//       )}

//       {/* navigation */}
//       <ul className="items-center hidden gap-24 text-xl md:flex">
//         <li className={`relative ${activeLink === "/" ? "active-link" : ""}`}>
//           <Link href="/" onClick={() => handleLinkClick("/")}>
//             Home
//           </Link>
//         </li>
//         <li
//           className={`relative ${activeLink === "/about" ? "active-link" : ""}`}
//         >
//           <Link href="/about" onClick={() => handleLinkClick("/about")}>
//             About us
//           </Link>
//         </li>
//         <li
//           className={`relative ${activeLink === "/books" ? "active-link" : ""}`}
//         >
//           <Link href="/books" onClick={() => handleLinkClick("/books")}>
//             Books
//           </Link>
//         </li>
//         <li
//           className={`relative ${activeLink === "/news" ? "active-link" : ""}`}
//         >
//           <Link href="/news" onClick={() => handleLinkClick("/news")}>
//             News
//           </Link>
//         </li>
//         {isAuthenticated ? (
//           <></>
//         ) : (
//           <li
//             className={`relative ${
//               activeLink === "/signup" ? "active-link" : ""
//             }`}
//           >
//             <Link href="/signup" onClick={() => handleLinkClick("/signup")}>
//               Register
//             </Link>
//           </li>
//         )}

//         {isAuthenticated && user ? (
//           <div
//             className="relative flex items-center gap-4 cursor-pointer"
//             onClick={toggleDropdown}
//           >
//             <Image
//               src={user.avatar}
//               width={48}
//               height={48}
//               className="object-cover w-12 h-12 rounded-full"
//               alt="User Avatar"
//             />
//             <h6 className=" py-2 text-base font-bold text-left text-[#063173]">
//               {user.fullname}
//             </h6>
//             {dropdown && (
//               <div className="dropdown-content absolute top-14 z-10 w-48 p-2 mt-2 bg-[#f5f5f5] border rounded shadow-md">
//                 <Link
//                   href="/profile"
//                   className="flex items-center  px-4 py-2 gap-2 hover:bg-gray-200"
//                 >
//                   <FaRegCircleUser color="#063173" />
//                   <h1 className="text-lg text-left text-black ">Profile</h1>
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center gap-2 w-full px-4 py-2 text-left text-black hover:bg-gray-200"
//                 >
//                   <IoMdLogOut color="#063173" />
//                   <span className="text-lg">Logout</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <li
//             className={`relative ${
//               activeLink === "/login" ? "active-link" : ""
//             }`}
//           >
//             <Link href="/login">
//               <button className="px-8 py-3 text-2xl font-bold text-primary border-[2px] border-primary hover:bg-primary hover:text-white duration-300">
//                 Login
//               </button>
//             </Link>
//           </li>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default Navbar;

"use client";
import { useAuth } from "@/context/userContext";
import ApiRequest from "@/utils/apiRequest";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";
import { toast } from "react-toastify";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, user, setUser } = useAuth();
  const router = useRouter();

  const [show, setShow] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  const toggleHamburger = () => setShow(!show);

  const handleLogout = async () => {
    try {
      const res = await ApiRequest.get("/user/logout");

      toast.success(res.data.messsage);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser({});
      router.push("/");
    } catch (error) {
      setUser({});
      toast.error(error?.response?.data?.message);
      setIsAuthenticated(false);
    }
  };

  const toggleDropdown = () => setDropdown(!dropdown);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-content")) {
        if (dropdown) {
          setDropdown(false);
        }
      }
    };

    if (dropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdown]);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <div className="flex items-center justify-between w-full px-4 pt-10 mx-auto text-black md:px-0 max-w-7xl">
      {/* logo */}
      <Link href="/">
        <Image
          src="/logo.png"
          width={158}
          height={79}
          alt=""
          className="z-20"
        />
      </Link>
      {/* hamburgerIcon */}
      <button onClick={toggleHamburger} className="z-50 text-2xl md:hidden">
        {show ? <FaTimes /> : <FaBars />}
      </button>
      {/* mobile screen */}
      {show && (
        <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-white md:hidden">
          <ul className="flex flex-col items-center gap-8 text-xl">
            <li>
              <Link href="/" onClick={toggleHamburger}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={toggleHamburger}>
                About us
              </Link>
            </li>
            <li>
              <Link href="/books" onClick={toggleHamburger}>
                Books
              </Link>
            </li>
            <li>
              <Link href="/news" onClick={toggleHamburger}>
                News
              </Link>
            </li>
            <li>
              <Link href="/exam" onClick={toggleHamburger}>
              Exams
              </Link>
              </li>

            {isAuthenticated ? (
              <li>
                <Link href="/profile" onClick={toggleHamburger}>
                  Profile
                </Link>
              </li>
            ) : (
              <li>
                <Link href="/signup" onClick={toggleHamburger}>
                  Register
                </Link>
              </li>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  toggleHamburger();
                }}
                className="text-primary"
              >
                Logout
              </button>
            ) : (
              <li>
                <Link href="/login" onClick={toggleHamburger}>
                  <button className="px-8 py-3 text-2xl font-bold text-primary border-[2px] border-primary hover:bg-primary hover:text-white duration-300">
                    Login
                  </button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* navigation */}
      <ul className="items-center hidden gap-24 text-xl md:flex">
        <li className={`relative ${activeLink === "/" ? "active-link" : ""}`}>
          <Link href="/" onClick={() => handleLinkClick("/")}>
            Home
          </Link>
        </li>
        <li
          className={`relative ${activeLink === "/about" ? "active-link" : ""}`}
        >
          <Link href="/about" onClick={() => handleLinkClick("/about")}>
            About us
          </Link>
        </li>
        <li
          className={`relative ${activeLink === "/books" ? "active-link" : ""}`}
        >
          <Link href="/books" onClick={() => handleLinkClick("/books")}>
            Books
          </Link>
        </li>
        <li
          className={`relative ${activeLink === "/news" ? "active-link" : ""}`}
        >
          <Link href="/news" onClick={() => handleLinkClick("/news")}>
            News
          </Link>
        </li>
       <li className={`relative ${activeLink === "/exam" ? "active-link" : ""}`}>
       <Link href="/exam" onClick={() => handleLinkClick("/exam")}>
       Exams
       </Link>
       </li>
        {isAuthenticated ? (
          <></>
        ) : (
          <li
            className={`relative ${
              activeLink === "/signup" ? "active-link" : ""
            }`}
          >
            <Link href="/signup" onClick={() => handleLinkClick("/signup")}>
              Register
            </Link>
          </li>
        )}

        {isAuthenticated && user ? (
          <div
            className="relative flex items-center gap-4 cursor-pointer"
            onClick={toggleDropdown}
          >
            <Image
              src={user.avatar}
              width={48}
              height={48}
              className="object-cover w-12 h-12 rounded-full"
              alt="User Avatar"
            />
            <h6 className=" py-2 text-base font-bold text-left text-[#063173]">
              {user.fullname}
            </h6>
            {dropdown && (
              <div className="dropdown-content absolute top-14 z-10 w-48 p-2 mt-2 bg-[#f5f5f5] border rounded shadow-md">
                <Link
                  href="/profile"
                  className="flex items-center  px-4 py-2 gap-2 hover:bg-gray-200"
                >
                  <FaRegCircleUser color="#063173" />
                  <h1 className="text-lg text-left text-black ">Profile</h1>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-black hover:bg-gray-200"
                >
                  <IoMdLogOut color="#063173" />
                  <span className="text-lg">Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <li
            className={`relative ${
              activeLink === "/login" ? "active-link" : ""
            }`}
          >
            <Link href="/login">
              <button className="px-8 py-3 text-2xl font-bold text-primary border-[2px] border-primary hover:bg-primary hover:text-white duration-300">
                Login
              </button>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
