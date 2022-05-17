import express, { Response, Request, NextFunction } from "express";
import routes from "./routes";
import dotenv from "dotenv";
import process from "process";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import csrf from "csurf";
import morgan from "morgan";
import { limiter } from "./configs/config.redis";

const whiteList = ["http://localhost:3000", "https://lads.vercel.app"];
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

/**
 * All middlewares are added here, Configurations required for the project to work like json parsing, .env , etc.
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); // Parses cookies
app.use(helmet()); // Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(express.json()); // Parses JSON bodies
app.use(
  cors({
    credentials: true,
    origin: whiteList,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);
app.use(
  csrf({
    cookie: {
      path: "/",
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  })
); // CSRF protection
app.use(morgan("tiny")); // Logs the requests
app.use(limiter); // Rate limiter

// CSRF Error Handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  if (err.code !== "EBADCSRFTOKEN") return next(err);
  // handle CSRF token errors here
  res.status(403);
  res.json({ error: "Form tampered" });
  return;
});
/**
 * All routes are added here to get more information why aren't the routes shown here
 * go to routes/index.ts for more information.
 */
app.use(routes);

//Instantiating the server
// We might use this sometime else but for now we will be relying on node balancing.
// if (cluster.isPrimary) {
//   for (let i = 0; i < threads; i++) {
//     cluster.fork();
//   }
//   cluster.on("exit", (worker, code, signal) => {
//     console.log(
//       `Worker ${worker.process.pid} died. Code number: ${code}. Signal: ${signal}`
//     );
//     cluster.fork();
//   });
// } else {
// app.listen(PORT, () => {
//   console.log(
//     `Server is running on port http://localhost:${PORT} and is handled by process ${process.pid}`
//   );
// });
// }

//test uncaughtexpections
process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("shutting down due to uncaught exception");
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

//test unhandledrejections
process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("shutting down the server due to unhandled promise rejection");
  process.exit(1);
});
