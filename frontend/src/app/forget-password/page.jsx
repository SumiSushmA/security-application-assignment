"use client";
import Link from "next/link";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { forgetPasswordSchema } from "@/schemas";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ApiRequest from "@/utils/apiRequest";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerificationError, setOtpVerificationError] = useState("");

  const initialValues = {
    email: "",
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: forgetPasswordSchema,
      onSubmit: async (values) => {
        try {
          setErrorMessage("");
          const res = await ApiRequest.post("/user/forget-password", values);
          // console.log(res);
          toast.success(res?.data?.message);
        } catch (error) {
          toast.error(error.response.data.message);
          setErrorMessage(error.message);
        }
      },
    });

  const handleSendOtp = async () => {
    try {
      setOtpVerificationError("");
      const res = await ApiRequest.post("/user/verify-otp", { otp });
      router.push("/reset-password");
    } catch (error) {
      console.log(error.response.data.message);
      setOtpVerificationError(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col gap-20 px-5 pb-40 mx-auto mt-10 md:px-0 md:mt-16 md:flex-row max-w-7xl">
      {/* left div with image */}
      <div className="hidden md:inline">
        <Image src="/login.png" alt="login" width={526} height={594} />
      </div>
      {/* right div with forms */}
      <div>
        <h1 className="text-xl italic font-bold md:text-3xl text-brown">
          Don’t worry, we got your back !!
        </h1>
        {/* form */}
        <form className="mt-8 md:mt-16" onSubmit={handleSubmit}>
          <div className="flex flex-col h-20 px-5 py-3 mb-4 bg-white border-l-4 border-transparent focus-within:border-primary">
            <label className="italic font-bold md:text-xl text-brown">
              Email Address
            </label>
            <input
              type="email"
              className="outline-none pt-1 font-bold italic md:text-xl text-[#122738] placeholder:font-bold placeholder:italic placeholder:text-[#122738] md:placeholder:text-xl"
              placeholder="name@company.com"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
          </div>
          {errors.email && touched.email && (
            <p className="px-4 text-lg italic text-red-500">{errors.email}</p>
          )}
          {errorMessage && (
            <p className="px-4 text-lg italic text-red-500">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="text-[#2F3336] md:text-xl font-bold italic">
            Send OTP
          </button>
        </form>

        {/* OTP code */}
        <div className="flex flex-col h-20 px-5 py-3 mt-6 bg-white border-l-4 border-transparent md:mt-20 focus-within:border-primary">
          <label
            htmlFor="otp"
            className="font-bold text-[#2F3336] italic md:text-xl">
            OTP
          </label>
          <input
            type="text"
            id="otp"
            className="outline-none pt-1 font-bold italic md:text-xl text-[#122738] placeholder:text-[#122738] md:placeholder:text-xl placeholder:italic placeholder:font-bold"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        {otpVerificationError && (
          <p className="px-4 text-lg italic text-red-500">
            {otpVerificationError}
          </p>
        )}

        <div className="flex items-center justify-between mt-8 md:mt-40">
          <button
            className="px-4 py-3 italic font-bold text-white duration-300 md:text-xl bg-primary hover:bg-primary/80"
            onClick={handleSendOtp}>
            Verify OTP
          </button>
          <Link href="/login">
            <button className="px-4 py-3 md:text-xl italic font-bold text-[#122738] ">
              Back to Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
