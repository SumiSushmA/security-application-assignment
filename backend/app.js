// //backend\app.js
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import express, { urlencoded } from "express";
// import rateLimit from "express-rate-limit";
// import morgan from "morgan";

// import mongoSanitize from "express-mongo-sanitize";
// import helmet from "helmet";
// import hpp from "hpp";
// import xss from "xss-clean";

// import globalErrorHandler from "./controllers/error.controller.js";
// import bookRoute from "./routes/book.route.js";
// import categoryRoute from "./routes/category.route.js";
// import newsRoute from "./routes/news.route.js";
// import questionRoute from "./routes/question.route.js";
// import quizRoute from "./routes/quiz.route.js";
// import scoreRoute from "./routes/score.route.js";
// import userRoute from "./routes/user.route.js";

// const app = express();

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   })
// );
// // Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// // Set security HTTP headers
// app.use(helmet());



// // Data sanitization against XSS
// app.use(xss());

// // Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       "name",
//       "email",
//       "password",
//       "passwordConfirm",
//       "role",
//       "photo",
//       "phone",
//       "address",
//     ],
//   })
// );

// // Middlewares
// app.use(morgan("dev"));
// app.use(express.json({ limit: "10kb" }));
// app.use(urlencoded({ extended: true }));

// app.use(cookieParser());

// // only throttle login & refresh‑token
// const authLimiter = rateLimit({
//   windowMs:  60 * 1000,  // 1 minute
//   max:       20,         // max 20 requests per IP per window
//   statusCode: 429,
//   message: {
//     status: 429,
//     message: "Too many requests — try again in 1 minute."
//   }
// });

// // apply it to just login & refresh-token
// app.use("/api/v1/user/login",         authLimiter);
// app.use("/api/v1/user/refresh-token", authLimiter);

// // Routes
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/news", newsRoute);
// app.use("/api/v1/book", bookRoute);
// app.use("/api/v1/question", questionRoute);
// app.use("/api/v1/quiz", quizRoute);
// app.use("/api/v1/score", scoreRoute);
// app.use("/api/v1/category", categoryRoute);

// // Global Error Handler
// app.use(globalErrorHandler);

// export default app;


// backend/app.js
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import xss from "xss-clean";

import bookRoute from "./routes/book.route.js";
import categoryRoute from "./routes/category.route.js";
import newsRoute from "./routes/news.route.js";
import questionRoute from "./routes/question.route.js";
import quizRoute from "./routes/quiz.route.js";
import scoreRoute from "./routes/score.route.js";
import userRoute from "./routes/user.route.js";

import globalErrorHandler from "./controllers/error.controller.js";

const app = express();

// ───── GLOBAL MIDDLEWARES ────────────────────────────────────────────────
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      "name",
      "email",
      "password",
      "passwordConfirm",
      "role",
      "photo",
      "phone",
      "address",
    ],
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// ───── ONLY RATE LIMIT LOGIN & REFRESH ───────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,                 // 20 requests per window per IP
  statusCode: 429,
  message: {
    status: 429,
    message: "Too many requests — try again in 1 minute.",
  },
});
app.use("/api/v1/user/login", authLimiter);
app.use("/api/v1/user/refresh-token", authLimiter);

// ───── ROUTES ────────────────────────────────────────────────────────────
app.use("/api/v1/user", userRoute);
app.use("/api/v1/news", newsRoute);
app.use("/api/v1/book", bookRoute);
app.use("/api/v1/question", questionRoute);
app.use("/api/v1/quiz", quizRoute);
app.use("/api/v1/score", scoreRoute);
app.use("/api/v1/category", categoryRoute);

// ───── GLOBAL ERROR HANDLER ──────────────────────────────────────────────
app.use(globalErrorHandler);

export default app;
