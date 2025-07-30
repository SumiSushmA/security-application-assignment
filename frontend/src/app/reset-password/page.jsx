"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFormik } from "formik";
import { loginSchema, resetPasswordSchema } from "@/schemas";
import ApiRequest from "@/utils/apiRequest";
import { useRouter, redirect } from "next/navigation";
import { useAuth } from "@/context/userContext";

const ResetPassword = () => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  if (!isAuthenticated && !user) {
    router.push("/login");
  }

  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: resetPasswordSchema,
      onSubmit: async (values) => {
        try {
          setErrorMessage("");
          const res = await ApiRequest.post("/user/reset-password", values);

          router.push("/login");
        } catch (error) {
          setErrorMessage(error.response?.data?.message);
        }
      },
    });
  return (
    <div className="flex flex-col w-full gap-20 px-5 pb-40 mx-auto mt-8 md:mt-16 md:flex-row max-w-7xl md:px-0">
      {/* left div with image  */}
      <div className="hidden md:inline">
        <Image src="/login.png" alt="login" width={526} height={594} />
      </div>
      {/* right div with forms */}
      <div className="flex-1 ">
        <h1 className="text-xl italic font-bold md:text-3xl text-brown">
          Reset Your Password!
        </h1>
        <form onSubmit={handleSubmit} className="mt-8 md:mt-12 md:w-4/5">
          <div className="flex flex-col h-20 px-5 py-3 bg-white border-l-4 border-transparent focus-within:border-primary">
            <label className="italic font-bold md:text-xl text-brown">
              New Password
            </label>
            <input
              type="password"
              placeholder="***********"
              className="outline-none pt-1 font-bold italic md:text-xl text-[#122738] placeholder:font-bold placeholder:italic placeholder:text-[#122738]/40 md:placeholder:text-xl"
              name="newPassword"
              value={values.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {errors.newPassword && touched.newPassword ? (
            <p className="px-4 mt-2 text-lg italic text-red-500">
              {errors.newPassword}
            </p>
          ) : (
            <></>
          )}
          <div className="flex flex-col h-20 px-5  py-3 bg-white border-l-4 border-transparent mt-16 focus-within:border-primary">
            <label className="italic font-bold md:text-xl text-brown ">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="***********"
              className="outline-none pt-2 placeholder:font-bold placeholder:italic placeholder:text-[#122738]/40 placeholder:text-xl"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {errors.confirmPassword && touched.confirmPassword ? (
            <p className="px-4 mt-2 text-lg italic text-red-500">
              {errors.confirmPassword}
            </p>
          ) : (
            <></>
          )}
          {/* check box and forget password */}

          {errorMessage ? (
            <p className="px-4 mt-2 text-lg italic text-red-500">
              {errorMessage}
            </p>
          ) : (
            <></>
          )}

          <div className="mt-12 space-x-16 md:mt-20">
            <button
              type="submit"
              className="px-4 py-3 italic font-bold text-white duration-300 md:text-xl bg-primary hover:bg-primary/80"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
