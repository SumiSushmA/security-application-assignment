import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { IoMdLock } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import * as yup from "yup";
import useLogin from "../../../hooks/useLogin";
import { authActions } from "../../../store/auth";
import { sanitizeUserInput } from "../../../utils/sanitizeHtml";
import loadingGif from "/BG/buttonLoading.gif";
import wallpaper from "/BG/wallpaper.jpg";
import logo2 from "/Logos/Logo2.png";

const schema = yup
  .object({
    email: yup.string().required("Email is required").email("Enter a valid email address"),
    password: yup.string().required("Password is required"),
  })
  .required();

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useLogin();
  const googleBtnRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10;
    const renderGoogleButton = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          type: "standard",
          size: "large",
          width: "360",
          theme: "outline",
          text: "signin_with",
          locale: "en_US",
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.style.opacity = 0;
          googleBtnRef.current.style.position = "absolute";
          googleBtnRef.current.style.top = 0;
          googleBtnRef.current.style.left = 0;
          googleBtnRef.current.style.width = "100%";
          googleBtnRef.current.style.height = "100%";
          googleBtnRef.current.style.zIndex = 10;
        }
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(renderGoogleButton, 300);
      }
    };
    renderGoogleButton();
    return () => {};
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/user/google-login",
        { credential: response.credential },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(authActions.login());
        dispatch(authActions.changeRole(res.data.user.role));
        toast.success("Google login successful!");
        window.location.href = "/";
      } else {
        toast.error("Google login failed!");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Google login failed!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (data) => {
    setLoading(true);
    setLoginError("");
    const sanitizedData = sanitizeUserInput(data);
    const result = await login(sanitizedData);
    setLoading(false);
    if (result?.error && result?.errorMessage) {
      setLoginError(result.errorMessage);
    }
    if (result?.twoFactorRequired) {
      setTwoFactorRequired(true);
      setOtpEmail(result.user.email);
      toast.success("OTP sent to your email. Please check your inbox.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("/api/user/verify-otp", { email: otpEmail, otp }, { withCredentials: true });
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data.message || "OTP verification failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen mx-auto max-w-[1300px] pt-8 px-6 pb-4">
      <div className="w-full lg:w-6/12 relative bg-cover bg-center flex flex-col justify-between"
        style={{ backgroundImage: `url(${wallpaper})`, borderRadius: "15%" }}>
        <Link to="/" className="p-4">
          <img src={logo2} alt="Logo" className="cursor-pointer md:w-44 w-28" />
        </Link>
      </div>

      <div className="w-full lg:w-6/12 flex flex-col justify-center">
        {!twoFactorRequired ? (
          <form
            onSubmit={handleSubmit(submit)}
            className="flex justify-center items-center flex-col"
          >
            <h1 className="text-2xl md:text-3xl font-ppMori mb-1 flex">Welcome to PlaceMate</h1>
            <h3>Please enter your credentials.</h3>
            {loginError && <div className="md:w-6/12 w-11/12 text-red-500 text-center text-sm mb-2">{loginError}</div>}

            <div className="md:w-6/12 w-11/12 h-12 border rounded-3xl border-gray-300 mt-14 flex items-center pl-4 pr-2">
              <MdEmail className="text-xl text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Email"
                className="w-full outline-none"
                {...register("email")}
                disabled={loading}
              />
            </div>
            {errors.email && <h6 className="md:w-5/12 w-11/12 text-red-500 text-xs">{errors.email.message}</h6>}

            <div className="md:w-6/12 w-11/12 h-12 border rounded-3xl border-gray-300 mt-4 flex items-center pl-4 pr-2">
              <IoMdLock className="text-xl text-gray-500 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full outline-none"
                {...register("password")}
                disabled={loading}
              />
              <span className="ml-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <AiFillEyeInvisible className="text-xl text-gray-500" />
                ) : (
                  <AiFillEye className="text-xl text-gray-500" />
                )}
              </span>
            </div>
            {errors.password && <h6 className="md:w-5/12 w-11/12 text-red-500 text-xs">{errors.password.message}</h6>}

            <div className="md:w-6/12 w-11/12 flex justify-end pt-3 pr-1">
              <Link to="/forgot-password">
                <h3 className="text-gray-500 cursor-pointer hover:text-black">Forgot password?</h3>
              </Link>
            </div>

            <button
              type="submit"
              className="mt-8 md:w-6/12 w-11/12 rounded-3xl h-12 bg-black text-white flex items-center justify-center hover:bg-[#403a4f]"
              disabled={loading}
            >
              {loading && <img src={loadingGif} alt="Loading..." className="w-7 h-7 mr-2" />}
              {loading ? "Sending OTP..." : "Login"}
            </button>

            <div className="md:w-6/12 w-11/12 flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="w-full flex justify-center relative">
              <button
                type="button"
                className="md:w-6/12 w-11/12 rounded-3xl h-12 bg-white border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-50"
                disabled={loading}
                onClick={() => googleBtnRef.current?.click()}
              >
                <FcGoogle className="w-6 h-6 mr-3" />
                Continue with Google
              </button>
              <div ref={googleBtnRef} className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}></div>
            </div>

            <div className="md:w-6/12 w-11/12 flex justify-center pt-3 pr-1">
              <h3 className="text-gray-500">Don't have an account?</h3>
              <Link to="/Signup">
                <h3 className="text-purple-700 ml-1 cursor-pointer underline">Sign up</h3>
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="flex flex-col items-center mt-20">
            <h2 className="text-2xl font-gilroySemiBold mb-4">Enter OTP</h2>
            <p className="mb-4 text-gray-600">An OTP has been sent to your email. Please enter it below.</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-80 p-2 border rounded-3xl mb-4 text-center text-lg tracking-widest"
              placeholder="Enter 6-digit OTP"
              required
              disabled={loading}
            />
            <button
              type="submit"
              className="w-80 bg-black text-white py-3 rounded-3xl hover:bg-gray-900 flex items-center justify-center"
              disabled={loading}
            >
              {loading && <img src={loadingGif} alt="Loading..." className="w-7 h-7 mr-2" />}
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
