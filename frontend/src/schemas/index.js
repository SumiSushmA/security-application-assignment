import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email().min(2).required("Email is required!"),
  password: yup.string().min(6).required("Enter your password!"),
});

export const registerSchema = yup.object({
  fullname: yup.string().min(2).max(25).required("Fullname is requried"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(6).required("Enter your password!"),
});

export const forgetPasswordSchema = yup.object({
  email: yup.string().email().min(2).required("Email is required!"),
});

export const resetPasswordSchema = yup.object({
  newPassword: yup.string().min(6).required("Please enter your password!"),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("newPassword"), null], "Password do not match!"),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required("Current Password is required"),
  password: yup
    .string()
    .required("New Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const profileUpdateSchema = yup.object({
  fullname: yup.string().required("Required"),
  phNumber: yup.string().length(10, "Invalid phone number"),
});
