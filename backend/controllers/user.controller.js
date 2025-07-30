// // backend/controllers/user.controller.js

// import jwt from "jsonwebtoken";
// import { v4 as uuidv4 } from "uuid";
// import User from "../models/user.model.js";
// import AppError from "../utils/AppError.js";
// import { CatchAsync } from "../utils/catchAsync.js";
// import {
//   deleteFromCloudinary,
//   uploadOnCloudinary,
// } from "../utils/cloudinary.js";
// import { sendEmail } from "../utils/sendEmail.js";

// // ============== Filter Object for allowed fields ================
// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach((el) => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };

// // ============== Generate Access and Refresh Tokens ================
// const generateAccessAndRefreshTokens = async (userId) => {
//   const user = await User.findById(userId);
//   if (!user) throw new AppError("User not found while generating tokens", 500);

//   const accessToken = user.generateAccessToken();
//   const refreshToken = user.generateRefreshToken();
//   user.refreshToken = refreshToken;
//   await user.save({ validateBeforeSave: false });

//   return { accessToken, refreshToken };
// };

// // ===================== CONTROLLERS =====================

// // REGISTER
// export const register = CatchAsync(async (req, res, next) => {
//   const { fullname, email, password, role } = req.body;
//   if (!fullname || !email || !password) {
//     return next(new AppError("Please fill in all required fields", 400));
//   }
//   if (await User.findOne({ email })) {
//     return next(new AppError("User already exists", 400));
//   }

//   const user = await User.create({ fullname, email, password, role });
//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
//     user._id
//   );

//   const cookieOpts = {
//     httpOnly: true,
//     secure: true,
//     overwrite: true,
//     sameSite: "none",
//   };
//   res
//     .status(201)
//     .cookie("accessToken", accessToken, cookieOpts)
//     .cookie("refreshToken", refreshToken, cookieOpts)
//     .json({
//       status: "success",
//       message: "User registered successfully",
//       data: { user: createdUser, accessToken, refreshToken },
//     });
// });

// // LOGIN
// export const login = CatchAsync(async (req, res, next) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return next(new AppError("Please provide email and password", 400));
//   }

//   const user = await User.findOne({ email }).select(
//     "+password +failedAttempts +lastFailedAttempt"
//   );
//   if (!user) return next(new AppError("Invalid credentials", 401));

//   // lockout logic
//   if (user.failedAttempts >= 10) {
//     const since = Date.now() - new Date(user.lastFailedAttempt).getTime();
//     if (since < 3600_000) {
//       return next(new AppError("Too many attempts, try again in 1 hour", 403));
//     }
//     user.failedAttempts = 0;
//     user.lastFailedAttempt = null;
//   }

//   const ok = await user.isPasswordCorrect(password);
//   if (!ok) {
//     user.failedAttempts++;
//     user.lastFailedAttempt = Date.now();
//     await user.save({ validateBeforeSave: false });
//     return next(new AppError("Invalid credentials", 401));
//   }

//   user.failedAttempts = 0;
//   user.lastFailedAttempt = null;
//   await user.save({ validateBeforeSave: false });

//   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
//     user._id
//   );
//   const safeUser = await User.findById(user._1d).select(
//     "-password -refreshToken"
//   );

//   const cookieOpts = {
//     httpOnly: true,
//     secure: true,
//     overwrite: true,
//     sameSite: "none",
//   };
//   res
//     .status(200)
//     .cookie("accessToken", accessToken, cookieOpts)
//     .cookie("refreshToken", refreshToken, cookieOpts)
//     .json({
//       status: "success",
//       message: "Logged in successfully",
//       data: { user: safeUser, accessToken, refreshToken },
//     });
// });

// // CREATE ADMIN (protected / admin only)
// export const createAdmin = CatchAsync(async (req, res, next) => {
//   const { fullname, email, password, role } = req.body;
//   if (!fullname || !email || !password) {
//     return next(new AppError("Please fill in all required fields", 400));
//   }
//   if (await User.findOne({ email })) {
//     return next(new AppError("User already exists", 400));
//   }

//   const user = await User.create({ fullname, email, password, role });
//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );
//   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
//     user._id
//   );

//   const cookieOpts = {
//     httpOnly: true,
//     secure: true,
//     overwrite: true,
//     sameSite: "none",
//   };
//   res
//     .status(201)
//     .cookie("accessToken", accessToken, cookieOpts)
//     .cookie("refreshToken", refreshToken, cookieOpts)
//     .json({
//       status: "success",
//       message: "Admin created successfully",
//       data: { user: createdUser, accessToken, refreshToken },
//     });
// });

// // FORGET PASSWORD → send OTP
// export const forgetPassword = CatchAsync(async (req, res, next) => {
//   const { email } = req.body;
//   if (!email) return next(new AppError("Email is required", 400));

//   const otp = uuidv4().slice(0, 6);
//   const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

//   const user = await User.findOneAndUpdate(
//     { email },
//     { passwordResetOTP: otp, passwordResetExpires: String(expires) },
//     { new: true }
//   );
//   if (!user) return next(new AppError("Email not found", 404));

//   await sendEmail({
//     email,
//     subject: "Your OTP Code",
//     message: `Your OTP is ${otp}. It expires in 10 minutes.`,
//   });

//   res.status(200).json({ status: "success", message: "OTP sent" });
// });

// // VERIFY OTP
// export const verifyOtp = CatchAsync(async (req, res, next) => {
//   const { otp } = req.body;
//   const user = await User.findOne({ passwordResetOTP: otp });
//   if (!user || Number(user.passwordResetExpires) < Date.now()) {
//     return next(new AppError("Invalid or expired OTP", 400));
//   }

//   user.passwordResetOTP = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save({ validateBeforeSave: false });

//   res.status(200).json({ status: "success", message: "OTP verified" });
// });

// // RESET PASSWORD (after OTP)
// export const resetPassword = CatchAsync(async (req, res, next) => {
//   const user = await User.findById(req.user._id).select("+password");
//   if (!user) return next(new AppError("User not found", 404));

//   const { newPassword, confirmPassword } = req.body;
//   if (!newPassword || newPassword !== confirmPassword) {
//     return next(new AppError("Passwords do not match", 400));
//   }

//   user.password = newPassword;
//   user.lastPasswordChange = Date.now();
//   await user.save();

//   res.status(200).json({ status: "success", message: "Password reset" });
// });

// // CHANGE PASSWORD (authenticated)
// export const changePassword = CatchAsync(async (req, res, next) => {
//   const user = await User.findById(req.user._id).select("+password");
//   const { currentPassword, newPassword, confirmPassword } = req.body;

//   if (
//     !currentPassword ||
//     !newPassword ||
//     newPassword !== confirmPassword ||
//     !(await user.isPasswordCorrect(currentPassword))
//   ) {
//     return next(new AppError("Invalid current password or mismatch", 400));
//   }

//   user.password = newPassword;
//   user.lastPasswordChange = Date.now();
//   await user.save({ validateBeforeSave: false });

//   res.status(200).json({ status: "success", message: "Password changed" });
// });

// // LOGOUT
// export const logout = CatchAsync(async (req, res) => {
//   await User.findByIdAndUpdate(req.user._id, {
//     $unset: { refreshToken: 1 },
//   });
//   res
//     .status(200)
//     .clearCookie("accessToken")
//     .clearCookie("refreshToken")
//     .json({ status: "success", message: "Logged out" });
// });

// // GET CURRENT USER
// export const getMe = CatchAsync(async (req, res, next) => {
//   const user = await User.findById(req.user._id).select(
//     "-password -refreshToken"
//   );
//   if (!user) return next(new AppError("User not found", 404));
//   res.status(200).json({ status: "success", data: { user } });
// });

// // GET ALL USERS (admin)
// export const getAllUsers = CatchAsync(async (_req, res) => {
//   const users = await User.find().select("-password -refreshToken");
//   res
//     .status(200)
//     .json({ status: "success", results: users.length, data: { users } });
// });

// // DELETE USER (admin)
// export const deleteUser = CatchAsync(async (req, res, next) => {
//   const doc = await User.findByIdAndDelete(req.params.id);
//   if (!doc) return next(new AppError("User not found", 404));
//   res.status(200).json({ status: "success", message: "User deleted" });
// });

// // UPDATE PROFILE
// export const updateProfile = CatchAsync(async (req, res) => {
//   const filtered = filterObj(req.body, "fullname", "phNumber");
//   const user = await User.findByIdAndUpdate(req.user._id, filtered, {
//     new: true,
//     runValidators: true,
//   }).select("-password -refreshToken");
//   res.status(200).json({ status: "success", data: { user } });
// });

// // UPDATE AVATAR
// export const updateAvatar = CatchAsync(async (req, res, next) => {
//   // 1) Check file
//   if (!req.file || !req.file.path) {
//     return next(new AppError("Avatar file is missing", 400));
//   }
//   // 2) Load user
//   const user = await User.findById(req.user._id);
//   if (!user) {
//     return next(new AppError("User not found", 404));
//   }
//   // 3) Delete old avatar if present
//   if (user.avatar) {
//     const parts = user.avatar.split("/");
//     const fileName = parts.pop().split(".")[0];
//     const folder = parts.includes("quizu") ? "quizu" : "";
//     const publicId = folder ? `${folder}/${fileName}` : fileName;
//     try {
//       await deleteFromCloudinary(publicId);
//     } catch (err) {
//       console.warn("Old avatar deletion failed, continuing:", err.message);
//     }
//   }
//   // 4) Upload new avatar
//   const uploadResult = await uploadOnCloudinary(req.file.path);
//   if (!uploadResult || !uploadResult.url) {
//     return next(new AppError("Failed to upload new avatar", 500));
//   }
//   // 5) Save & respond
//   user.avatar = uploadResult.url;
//   await user.save({ validateBeforeSave: false });

//   res.status(200).json({
//     status: "success",
//     message: "Avatar updated successfully",
//     data: { avatar: user.avatar },
//   });
// });

// // REFRESH ACCESS TOKEN
// export const refreshAccessToken = CatchAsync(async (req, res, next) => {
//   const incoming = req.cookies.refreshToken || req.body.refreshToken;
//   if (!incoming) return next(new AppError("No refresh token", 401));

//   let decoded;
//   try {
//     decoded = jwt.verify(incoming, process.env.REFRESH_TOKEN_SECRET);
//   } catch {
//     return next(new AppError("Invalid refresh token", 401));
//   }

//   const user = await User.findById(decoded._id);
//   if (!user || user.refreshToken !== incoming) {
//     return next(new AppError("Expired refresh token", 401));
//   }

//   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
//     user._id
//   );
//   res
//     .status(200)
//     .cookie("accessToken", accessToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//     })
//     .cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//     })
//     .json({ status: "success", message: "Token refreshed" });
// });

// backend/controllers/user.controller.js

import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";

// ============== Filter Object for allowed fields ================
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// ============== Generate Access and Refresh Tokens ================
const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found while generating tokens", 500);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// ===================== CONTROLLERS =====================

// REGISTER
export const register = CatchAsync(async (req, res, next) => {
  const { fullname, email, password, role } = req.body;
  if (!fullname || !email || !password) {
    return next(new AppError("Please fill in all required fields", 400));
  }
  if (await User.findOne({ email })) {
    return next(new AppError("User already exists", 400));
  }

  const user = await User.create({ fullname, email, password, role });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const cookieOpts = {
    httpOnly: true,
    secure: true,
    overwrite: true,
    sameSite: "none",
  };
  res
    .status(201)
    .cookie("accessToken", accessToken, cookieOpts)
    .cookie("refreshToken", refreshToken, cookieOpts)
    .json({
      status: "success",
      message: "User registered successfully",
      data: { user: createdUser, accessToken, refreshToken },
    });
});

// LOGIN
export const login = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select(
    "+password +failedAttempts +lastFailedAttempt"
  );
  if (!user) return next(new AppError("Invalid credentials", 401));

  // lockout logic
  if (user.failedAttempts >= 10) {
    const since = Date.now() - new Date(user.lastFailedAttempt).getTime();
    if (since < 3600_000) {
      return next(new AppError("Too many attempts, try again in 1 hour", 403));
    }
    user.failedAttempts = 0;
    user.lastFailedAttempt = null;
  }

  const ok = await user.isPasswordCorrect(password);
  if (!ok) {
    user.failedAttempts++;
    user.lastFailedAttempt = Date.now();
    await user.save({ validateBeforeSave: false });
    return next(new AppError("Invalid credentials", 401));
  }

  user.failedAttempts = 0;
  user.lastFailedAttempt = null;
  await user.save({ validateBeforeSave: false });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const safeUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const cookieOpts = {
    httpOnly: true,
    secure: true,
    overwrite: true,
    sameSite: "none",
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOpts)
    .cookie("refreshToken", refreshToken, cookieOpts)
    .json({
      status: "success",
      message: "Logged in successfully",
      data: { user: safeUser, accessToken, refreshToken },
    });
});

// CREATE ADMIN (protected / admin only)
export const createAdmin = CatchAsync(async (req, res, next) => {
  const { fullname, email, password, role } = req.body;
  if (!fullname || !email || !password) {
    return next(new AppError("Please fill in all required fields", 400));
  }
  if (await User.findOne({ email })) {
    return next(new AppError("User already exists", 400));
  }

  const user = await User.create({ fullname, email, password, role });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const cookieOpts = {
    httpOnly: true,
    // secure: true,
    secure: process.env.NODE_ENV === "production",
    overwrite: true,
    sameSite: "none",
    path: "/",     // <— add this
  };
  res
    .status(201)
    .cookie("accessToken", accessToken, cookieOpts)
    .cookie("refreshToken", refreshToken, cookieOpts)
    .json({
      status: "success",
      message: "Admin created successfully",
      data: { user: createdUser, accessToken, refreshToken },
    });
});

// FORGET PASSWORD → send OTP
export const forgetPassword = CatchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError("Email is required", 400));

  const otp = uuidv4().slice(0, 6);
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

  const user = await User.findOneAndUpdate(
    { email },
    { passwordResetOTP: otp, passwordResetExpires: String(expires) },
    { new: true }
  );
  if (!user) return next(new AppError("Email not found", 404));

  await sendEmail({
    email,
    subject: "Your OTP Code",
    message: `Your OTP is ${otp}. It expires in 10 minutes.`,
  });

  res.status(200).json({ status: "success", message: "OTP sent" });
});

// VERIFY OTP
export const verifyOtp = CatchAsync(async (req, res, next) => {
  const { otp } = req.body;
  const user = await User.findOne({ passwordResetOTP: otp });
  if (!user || Number(user.passwordResetExpires) < Date.now()) {
    return next(new AppError("Invalid or expired OTP", 400));
  }

  user.passwordResetOTP = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ status: "success", message: "OTP verified" });
});

// RESET PASSWORD (after OTP)
export const resetPassword = CatchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  if (!user) return next(new AppError("User not found", 404));

  const { newPassword, confirmPassword } = req.body;
  if (!newPassword || newPassword !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }

  user.password = newPassword;
  user.lastPasswordChange = Date.now();
  await user.save();

  res.status(200).json({ status: "success", message: "Password reset" });
});

// CHANGE PASSWORD (authenticated)
export const changePassword = CatchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (
    !currentPassword ||
    !newPassword ||
    newPassword !== confirmPassword ||
    !(await user.isPasswordCorrect(currentPassword))
  ) {
    return next(new AppError("Invalid current password or mismatch", 400));
  }

  user.password = newPassword;
  user.lastPasswordChange = Date.now();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ status: "success", message: "Password changed" });
});

// LOGOUT
export const logout = CatchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 },
  });
  res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({ status: "success", message: "Logged out" });
});

// GET CURRENT USER
export const getMe = CatchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!user) return next(new AppError("User not found", 404));
  res.status(200).json({ status: "success", data: { user } });
});

// GET ALL USERS (admin)
export const getAllUsers = CatchAsync(async (_req, res) => {
  const users = await User.find().select("-password -refreshToken");
  res
    .status(200)
    .json({ status: "success", results: users.length, data: { users } });
});

// DELETE USER (admin)
export const deleteUser = CatchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndDelete(req.params.id);
  if (!doc) return next(new AppError("User not found", 404));
  res.status(200).json({ status: "success", message: "User deleted" });
});

// UPDATE PROFILE
export const updateProfile = CatchAsync(async (req, res) => {
  const filtered = filterObj(req.body, "fullname", "phNumber");
  const user = await User.findByIdAndUpdate(req.user._id, filtered, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken");
  res.status(200).json({ status: "success", data: { user } });
});

// UPDATE AVATAR
export const updateAvatar = CatchAsync(async (req, res, next) => {
  // 1) Check file
  if (!req.file || !req.file.path) {
    return next(new AppError("Avatar file is missing", 400));
  }
  // 2) Load user
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  // 3) Delete old avatar if present
  if (user.avatar) {
    const parts = user.avatar.split("/");
    const fileName = parts.pop().split(".")[0];
    const folder = parts.includes("quizu") ? "quizu" : "";
    const publicId = folder ? `${folder}/${fileName}` : fileName;
    try {
      await deleteFromCloudinary(publicId);
    } catch (err) {
      console.warn("Old avatar deletion failed, continuing:", err.message);
    }
  }
  // 4) Upload new avatar
  const uploadResult = await uploadOnCloudinary(req.file.path);
  if (!uploadResult || !uploadResult.url) {
    return next(new AppError("Failed to upload new avatar", 500));
  }
  // 5) Save & respond
  user.avatar = uploadResult.url;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Avatar updated successfully",
    data: { avatar: user.avatar },
  });
});

// REFRESH ACCESS TOKEN
export const refreshAccessToken = CatchAsync(async (req, res, next) => {
  const incoming = req.cookies.refreshToken || req.body.refreshToken;
  if (!incoming) return next(new AppError("No refresh token", 401));

  let decoded;
  try {
    decoded = jwt.verify(incoming, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    return next(new AppError("Invalid refresh token", 401));
  }

  const user = await User.findById(decoded._id);
  if (!user || user.refreshToken !== incoming) {
    return next(new AppError("Expired refresh token", 401));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      // secure: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",     // <— add this
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",     // <— add this
    })
    .json({ status: "success", message: "Token refreshed" });
});
