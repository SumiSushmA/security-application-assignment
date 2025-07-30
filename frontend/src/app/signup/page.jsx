"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Changed from 'next/navigation'
import { useAuth } from "@/context/userContext";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { registerSchema } from "@/schemas";
import ApiRequest from "@/utils/apiRequest";
import PasswordStrengthBar from "react-password-strength-bar";

const Signup = () => {
  const { isAuthenticated, user, setIsAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/profile");
    }
  }, []);

  const initialValues = {
    fullname: "",
    email: "",
    password: "",
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: registerSchema,
      onSubmit: async (values) => {
        try {
          setIsLoading(true);
          setErrorMessage("");
          const res = await ApiRequest.post("/user/register", values);
          // console.log(res);
          setIsAuthenticated(true);
          setIsLoading(false);
          router.push("/profile");
        } catch (error) {
          setIsLoading(false);
          setIsAuthenticated(false);
          setErrorMessage(error.response?.data?.message);
        }
      },
    });

  return (
    <div className="flex flex-col w-full gap-20 px-5 pb-40 mx-auto mt-8 md:flex-row md:px-0 md:mt-16 max-w-7xl">
      {/* left div with image  */}
      <div className="hidden md:inline">
        <Image src="/login.png" alt="login" width={526} height={594} />
      </div>
      {/* right div with forms */}
      <div className="w-[560px]">
        <h1 className="text-xl italic font-bold md:text-3xl text-brown">
          Hello User, you will have a great <br /> journey
        </h1>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex flex-col h-20 px-5 py-3 bg-white border-l-4 border-transparent focus-within:border-primary ">
            <label className="italic font-bold md:text-xl text-brown">
              Full Name
            </label>
            <input
              type="text"
              className="outline-none pt-1 placeholder:font-bold placeholder:italic placeholder:text-[#122738]/40 md:placeholder:text-xl font-bold italic md:text-xl text-[#122738]"
              placeholder="Your Name"
              name="fullname"
              value={values.fullname}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {errors.fullname && touched.fullname ? (
            <p className="px-4 mt-2 text-lg italic text-red-500">
              {errors.fullname}
            </p>
          ) : null}
          <div className="flex flex-col h-20 px-5 py-3 bg-white border-l-4 border-transparent mt-9 focus-within:border-primary">
            <label className="italic font-bold md:text-xl text-brown">
              Email Address
            </label>
            <input
              type="email"
              className="outline-none pt-1 placeholder:font-bold placeholder:italic placeholder:text-[#122738]/40 md:placeholder:text-xl font-bold italic md:text-xl text-[#122738]"
              placeholder="name@company.com"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {errors.email && touched.email ? (
            <p className="px-4 mt-2 text-lg italic text-red-500">
              {errors.email}
            </p>
          ) : null}
          <div className="flex flex-col h-20 px-5 py-3 bg-white border-l-4 border-transparent mt-9 focus-within:border-primary">
            <label className="italic font-bold md:text-xl text-brown">
              Password
            </label>
            <input
              type="password"
              className="outline-none pt-1 placeholder:font-bold placeholder:italic placeholder:text-[#122738]/40 md:placeholder:text-xl"
              placeholder="****************"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {values.password && (
              <PasswordStrengthBar password={values.password} />
            )}
          </div>
          {errors.password && touched.password ? (
            <p className="px-4 mt-2 text-lg italic text-red-500 ">
              {errors.password}
            </p>
          ) : null}
          {errorMessage ? (
            <p className="px-4 mt-2 text-lg italic text-red-500">
              {errorMessage}
            </p>
          ) : null}
          <div className="mt-6 space-x-16">
            <button
              type="submit"
              className="px-4 py-3 italic font-bold text-white duration-300 md:text-xl bg-primary hover:bg-primary/80"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Signup"}
            </button>
            <Link href="/login">
              <button className="px-4 py-3 md:text-xl italic font-bold bg-[#FFFFFF] text-[#122738] border-2 border-[#122738]">
                Login
              </button>
            </Link>
          </div>
        </form>

        {/* login with google and facebook */}
        {/* <div className="flex items-center justify-between mt-6 md:mt-20">
          <p className="italic font-bold md:text-xl text-brown">
            or login with
          </p>

          <div className="flex gap-12">
            <p className="text-[#122738] font-bold md:text-xl italic">
              Facebook
            </p>
            <p className="text-[#122738] font-bold md:text-xl italic">Google</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Signup;
