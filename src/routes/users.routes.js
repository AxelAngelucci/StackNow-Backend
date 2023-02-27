import { Router } from "express";
import {
  currentUser,
  deleteUser,
  getAllUsers,
  getUserById,
  login,
  signupUser,
  updateUser,
  reactiveUser,
} from "../controllers/users.controller.js";
import {
  getIdValidations,
  logInUserValidations,
  signupUserValidations,
  isAutenticated,
  validId,
} from "../middlewares/users.middlewares.js";
import upload from "../lib/storage.js";

const userRouter = Router();

userRouter.route("/list").get(isAutenticated, getAllUsers);

userRouter.route("/list/:id").get(getIdValidations, getUserById);

userRouter.route("/signup").post(signupUserValidations, signupUser);
userRouter.route("/login").post(login);
userRouter
  .route("/current")
  .post(isAutenticated, upload.single("image"), currentUser);
userRouter
  .route("/update")
  .post(isAutenticated, upload.single("image"), updateUser);

userRouter.patch("/delete/:id", [isAutenticated, validId], deleteUser);

userRouter.patch("/active/:id", [isAutenticated, validId], reactiveUser);

export default userRouter;
