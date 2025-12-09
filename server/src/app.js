import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan"; // for request logging
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import passport from "passport";
import "./services/passport.js";
import { router as apiRouter } from "./routes/index.js";
import { serve } from "inngest/express"
import { inngest } from "./inngest/index.js"
import { helloWorld } from "./inngest/functions/helloWorld.js"
import { onUserSignup } from "./inngest/functions/on-signup.js"
import { onUserForgotPassword } from "./inngest/functions/on-forgot-password.js"
import { onUserPasswordChange } from "./inngest/functions/on-password-change.js";
import { onInquirySubmission } from "./inngest/functions/on-inquiry-submission.js";
import { onQuotationApproved } from "./inngest/functions/on-quotation-approved.js";
import { deserializeUser } from "./middlewares/deserializeuser.js";

const app = express();

// Middleware
app.use(helmet());  // security headers
app.use(cors({
  origin: ['http://localhost:5173', 'https://solvify-topaz.vercel.app', 'https://solvify-kumarprakharkp143-3045s-projects.vercel.app'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());  // parse JSON body
app.use(express.urlencoded({ extended: true }));  // parse from data
app.use(morgan("dev"));  // logs requests (GET /api 200 - 15ms)

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
    keys: [process.env.COOKIE_KEY]
  })
)

app.use(passport.initialize());
app.use(passport.session())

// Set up the "/api/inngest" routes with the serve handler
app.use("/api/inngest", serve({
  client: inngest,
  functions: [helloWorld, onUserSignup, onUserForgotPassword, onUserPasswordChange, onInquirySubmission, onQuotationApproved]
}));

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is healty" });
});

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Solvify API 🚀" });
});

// Inngest test route
app.get("/api/hello", async function (req, res, next) {
  await inngest.send({
    name: "test/hello.world",
    data: {
      email: "testUser@example.com",
    },
  }).catch(err => next(err));
  res.json({ message: 'Event sent!' });
});

// Apply globally -> every request will check for a token if present
app.use(deserializeUser);

// API routes
app.use("/api", apiRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error handler:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

export { app };