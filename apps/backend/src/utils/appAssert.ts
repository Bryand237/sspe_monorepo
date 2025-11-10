import AppErrorCode from "../constants/appErrorCode";
import { HttpStatusCode } from "../constants/http";
import assert from "node:assert";
import AppError from "./appError";

type AppAssert = (
  condition: any,
  http: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

const appAssert: AppAssert = (condition, http, message, appErrorCode?) =>
  assert(condition, new AppError(http, message, appErrorCode));

export default appAssert;
