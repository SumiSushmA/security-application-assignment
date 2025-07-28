import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
import validator from "validator";

const { isStrongPassword } = validator;

const userSchema = new Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    avatar: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png",
    },
    phNumber: Number,
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      validate: {
        validator(value) {
          return isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          });
        },
        message:
          "Password must include at least 8 characters, one uppercase, one number, and one symbol.",
      },
    },
    refreshToken: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    passwordResetOTP: String,
    passwordResetExpires: Date,
    failedAttempts: { type: Number, default: 0 },
    lastFailedAttempt: Date,
    lastPasswordChange: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcryptjs.hashSync(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = function (candidate) {
  return bcryptjs.compareSync(candidate, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, fullname: this.fullname, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export default mongoose.model("User", userSchema);
