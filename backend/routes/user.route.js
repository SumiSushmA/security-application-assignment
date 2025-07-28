import express from "express";
import {
  changePassword,
  createAdmin,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getMe,
  login,
  logout,
  refreshAccessToken,
  register,
  resetPassword,
  updateAvatar,
  updateProfile,
  verifyOtp,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.js";
import { restrictTo } from "../middleware/restrictTo.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.get("/logout", verifyJWT, logout);

router.get("/me", verifyJWT, getMe);
router.patch("/change-password", verifyJWT, changePassword);

router.post("/forget-password", forgetPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", verifyJWT, resetPassword);

router.patch("/update-profile", verifyJWT, updateProfile);
router.patch("/avatar", verifyJWT, upload.single("avatar"), updateAvatar);

router.post("/create-admin", verifyJWT, restrictTo("admin"), createAdmin);
router.get("/", verifyJWT, restrictTo("admin"), getAllUsers);
router.delete("/:id", verifyJWT, restrictTo("admin"), deleteUser);

export default router;
