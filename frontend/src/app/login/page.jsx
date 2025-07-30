"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFormik } from "formik";
import { loginSchema } from "@/schemas";
import ApiRequest from "@/utils/apiRequest";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/userContext";
import { toast } from "react-toastify";

const Login = () => {
  const { isAuthenticated, setUser, user, setIsAuthenticated } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // console.log(isAuthenticated, user);

  const initialValues = {
    email: "",
    password: "",
  };
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: loginSchema,
      onSubmit: async (values) => {
        try {
          setIsLoading(true);
          const res = await ApiRequest.post("/user/login", values);
          const { loggedInUser } = res?.data?.data;

          // console.log(res);
          localStorage.setItem(
            "token",
            JSON.stringify(res?.data?.data?.refreshToken)
          );
          toast.success(res?.data?.message);
          setIsAuthenticated(true);
          setUser(loggedInUser);
          setIsLoading(false);
          router.push("/");
        } catch (error) {
          toast.error(error?.response?.data?.message);
          setIsLoading(false);
          setIsAuthenticated(false);
          setErrorMessage(error.response?.data?.message);
        }
      },
    });

  if (isAuthenticated && user) {
    router.push("/");
    return null;
  }

  return (
    <div className="flex flex-col w-full gap-20 px-5 pb-40 mx-auto mt-8 md:mt-16 md:flex-row max-w-7xl md:px-0">
      {/* left div with image */}
      <div className="hidden md:inline">
        <Image src="/login.png" alt="login" width={526} height={594} />
      </div>
      {/* right div with forms */}
      <div>
        <h1 className="text-xl italic font-bold md:text-3xl text-brown">
          Welcome Back, You have been missed
        </h1>
        <form onSubmit={handleSubmit} className="mt-8 md:mt-20">
          <div className="flex flex-col h-20 px-5 py-3 bg-white border-l-4 border-transparent focus-within:border-primary">
            <label className="italic font-bold md:text-xl text-brown">
              Email Address
            </label>
            <input
              type="email"
              className="outline-none pt-1 font-bold italic md:text-xl text-[#122738] placeholder:font-bold placeholder:italic placeholder:text-[#122738]/40 md:placeholder:text-xl"
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
          ) : (
            <></>
          )}
          <div className="flex flex-col h-20 px-5 py-3 bg-white border-l-4 border-transparent mt-9 focus-within:border-primary">
            <label className="italic font-bold md:text-xl text-brown ">
              Password
            </label>
            <input
              type="password"
              className="outline-none pt-2 placeholder:font-bold placeholder:italic placeholder:text-[#122738]/40 placeholder:text-xl"
              placeholder="**************"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {errors.password && touched.password ? (
            <p className="px-4 mt-2 text-lg italic text-red-500">
              {errors.password}
            </p>
          ) : (
            <></>
          )}
          {/* check box and forget password */}
          <div className="flex items-center justify-between pt-9">
            {/* <div>
              <input type="checkbox" value="" />
              <label
                htmlFor=""
                className="pl-1 text-lg italic font-bold md:text-xl text-brown"
              >
                Remember Me
              </label>
            </div> */}
            <Link href="/forget-password">
              <p className="text-lg italic font-bold md:text-xl text-brown">
                Forgot Password?
              </p>
            </Link>
          </div>
          {errorMessage ? (
            <p className="px-4 mt-2 text-lg italic text-red-500">
              {errorMessage}
            </p>
          ) : (
            <></>
          )}

          <div className="mt-12 space-x-16 md:mt-14">
            <button
              type="submit"
              className="px-4 py-3 italic font-bold text-white duration-300 md:text-xl bg-primary hover:bg-primary/80"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
            <Link href="/signup">
              <button className="px-4 py-3 md:text-xl italic font-bold bg-[#FFFFFF]  text-[#122738] border-2 border-[#122738]">
                Signup
              </button>
            </Link>
          </div>
        </form>

        {/* login with google and facebook */}
        {/* <div className="flex items-center justify-between mt-10 md:mt-20">
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
export default Login;
