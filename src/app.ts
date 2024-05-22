import { Application, NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import httpStatus from "http-status";
const app: Application = express();

app.use(cors());
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Hello",
  });
});

app.use("/api", router);
app.use(globalErrorHandler);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API not found!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not available",
    },
  });
});

export default app;
