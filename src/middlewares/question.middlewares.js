import Question from "../models/question.js";
import { check } from "express-validator";

const verifyTopic = check(
  "topic",
  "The topic must contain a minimum of 10 characters and a maximum of 100."
).isLength({ min: 10, max: 100 });

const questionExists = check("topic").custom(async (topic) => {
  const questionFound = await Question.findOne({ topic });
  if (questionFound) {
    throw new Error("Topic already exists");
  }
}); //Verificar que el topico no exista en la db

const validMessageLength = check(
  "message",
  "The message must contain a minimum of 30 characters and a maximum of 1000."
).isLength({ min: 30, max: 1000 }); //Verificar longitud del mensaje

const validNewQuestion = [verifyTopic, questionExists, validMessageLength];

export { validNewQuestion };
