import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { IoMdLock } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import * as yup from "yup";
import useRegister from "../../../hooks/useRegister";
import { sanitizeUserInput } from "../../../utils/sanitizeHtml";
import loadingGif from "/BG/buttonLoading.gif";
import wallpaper from "/BG/wallpaper.jpg";
import logo2 from "/Logos/Logo2.png";

const schema = yup
  .object({
    name: yup
      .string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters"),
    email: yup
      .string()
      .required("Email is required")
      .email("Enter a valid email address"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain an uppercase letter")
      .matches(/[a-z]/, "Must contain a lowercase letter")
      .matches(/[0-9]/, "Must contain a number")
      .matches(/[!@#$%^&*(),.?\":{}|<>]/, "Must contain a special character"),
    captchaAnswer: yup
      .string()
      .required("Please type the characters shown")
      .test("captcha", "Incorrect characters", function (value) {
        const expected = this.parent.captchaText;
        if (!value || !expected) return false;
        return value.trim().toLowerCase() === expected.trim().toLowerCase();
      }),
  })
  .required();

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({ resolver: yupResolver(schema) });

  const { registerUser, loading } = useRegister();
  const [captchaText, setCaptchaText] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const password = watch("password", "");

  useEffect(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let text = "";
    for (let i = 0; i < 5; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    setValue("captchaText", text);
  }, [setValue]);

  useEffect(() => {
    setPasswordChecks({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?\":{}|<>]/.test(password),
    });

    const score = Object.values(passwordChecks).filter(Boolean).length;
    if (score <= 2) setPasswordStrength("Weak");
    else if (score <= 4) setPasswordStrength("Medium");
    else setPasswordStrength("Strong");
  }, [password]);

  const submit = async (data) => {
    const { captchaAnswer, captchaText, ...rest } = data;
    const cleanRest = sanitizeUserInput(rest);
    await registerUser({ ...cleanRest, captchaAnswer, captchaText });
  };

  return (
    <div className="flex w-full mx-auto max-w-[1300px] pt-8 px-6 pb-4">
      <div className="w-full lg:w-6/12 pb-10">
        <Link to="/">
          <img src={logo2} alt="Logo" className="cursor-pointer md:w-44 w-28" />
        </Link>
        <div className="flex justify-center items-center flex-col mt-8">
          <h1 className="text-2xl md:text-3xl font-ppMori mb-1 flex">Welcome to PlaceMate</h1>
          <h3>Please enter your details.</h3>
          <form onSubmit={handleSubmit(submit)} className="w-full flex flex-col items-center">
            <div className="md:w-6/12 w-11/12 h-12 border border-gray-300 rounded-3xl mt-8 flex items-center pl-4 pr-2">
              <BsFillPersonFill className="text-xl text-gray-500 mr-2" />
              <input type="text" placeholder="Full Name" className="w-full outline-none" {...register("name")} />
            </div>
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}

            <div className="md:w-6/12 w-11/12 h-12 border border-gray-300 rounded-3xl mt-4 flex items-center pl-4 pr-2">
              <MdEmail className="text-xl text-gray-500 mr-2" />
              <input type="email" placeholder="Email" className="w-full outline-none" {...register("email")} />
            </div>
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

            <div className="md:w-6/12 w-11/12 h-12 border border-gray-300 rounded-3xl mt-4 flex items-center pl-4 pr-2 relative">
              <IoMdLock className="text-xl text-gray-500 mr-2" />
              <input type={passwordVisible ? "text" : "password"} placeholder="Password" className="w-full outline-none" {...register("password")} />
              <span
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 cursor-pointer text-gray-500"
              >
                {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

            <p className={`text-sm mt-1 ${
              passwordStrength === "Weak" ? "text-red-500" : passwordStrength === "Medium" ? "text-yellow-500" : "text-green-600"
            }`}>
              Strength: {passwordStrength || ""}
            </p>

            <div className="md:w-6/12 w-11/12 text-xs text-gray-600 mt-2">
              <p>Password must contain:</p>
              <ul className="ml-4 mt-1 space-y-1">
                <li className={passwordChecks.length ? "text-green-600" : ""}>• At least 8 characters</li>
                <li className={passwordChecks.uppercase ? "text-green-600" : ""}>• One uppercase letter (A-Z)</li>
                <li className={passwordChecks.lowercase ? "text-green-600" : ""}>• One lowercase letter (a-z)</li>
                <li className={passwordChecks.number ? "text-green-600" : ""}>• One number (0-9)</li>
                <li className={passwordChecks.special ? "text-green-600" : ""}>• One special character (!@#$%^&*(),.?":{}|&lt;&gt;)</li>
              </ul>
            </div>

            <div className="md:w-6/12 w-11/12 mt-4">
              <span className="text-sm font-medium text-gray-700">Type the characters you see below:</span>
              <div className="flex items-center justify-between mt-1">
                <div className="bg-gray-100 font-mono text-xl px-4 py-2 rounded select-none tracking-widest">
                  {captchaText}
                </div>
                <input
                  type="text"
                  placeholder="Enter Captcha"
                  className="h-12 border border-gray-300 rounded px-2 text-sm outline-none text-center w-32"
                  {...register("captchaAnswer")}
                />
              </div>
              {errors.captchaAnswer && <p className="text-red-500 text-xs mt-1">{errors.captchaAnswer.message}</p>}
            </div>
            <input type="hidden" {...register("captchaText")} />

            <button type="submit" className="mt-6 md:w-6/12 w-11/12 h-12 bg-black text-white rounded-3xl font-medium flex items-center justify-center">
              {loading ? <img src={loadingGif} alt="Loading..." className="w-6 h-6" /> : "Sign Up"}
            </button>
          </form>
          <div className="md:w-6/12 w-11/12 flex justify-center pt-3">
            <h3 className="text-gray-500">Already have an account?</h3>
            <Link to="/Login">
              <h3 className="text-purple-700 ml-1 underline">Sign in</h3>
            </Link>
          </div>
        </div>
      </div>
      <div className="lg:w-6/12 h-screen bg-cover bg-center" style={{ backgroundImage: `url(${wallpaper})`, borderRadius: "15%" }}></div>
    </div>
  );
};

export default RegisterPage;

