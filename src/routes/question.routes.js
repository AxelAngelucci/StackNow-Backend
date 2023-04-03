import Router from "express";
import {
  NewQuestion,
  deleteQuestion,
  getAllQuestion,
  getQuestionId,
  getQuestionByCategory,
  questionByUser,
  searchQuestions,
} from "../controllers/question.controller.js";
import { isAutenticated, validId } from "../middlewares/users.middlewares.js";
import validResult from "../middlewares/commons.js";
import {
  AdminRole,
  questionExists,
  validNewQuestion,
} from "../middlewares/question.middlewares.js";

const routerQuestion = Router();

routerQuestion.get("/", getAllQuestion);

routerQuestion.get("/search", searchQuestions); //Se pasa el name de la categoría

routerQuestion.get("/category/:id", getQuestionByCategory); //Se pasa el id de la categoría

routerQuestion.get("/:id", getQuestionId);

routerQuestion.post(
  "/",
  [isAutenticated, validNewQuestion, validResult],
  NewQuestion
);

routerQuestion.delete(
  "/:id",
  [isAutenticated, AdminRole, validResult],
  deleteQuestion
);

routerQuestion.get("/myquestions/:id", questionByUser);

export { routerQuestion };
