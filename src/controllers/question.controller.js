import Question from "../models/Question.js";
import { response, request } from "express";
import Category from "../models/Category.js";
import db from "../db/config.js";

const NewQuestion = async (req, res) => {
  const category = req.body.category;
  const topic = req.body.topic;
  const message = req.body.message;
  const user = req.user.id;
  const topicDB = await Question.findOne({ topic });
  if (topicDB) {
    return res.status(400).json({
      msg: `El asunto ${topicDB.topic} ya existe`,
    });
  }
  //Generar la data a guardar
  const data = {
    category,
    topic,
    message,
    user,
  };

  const question = new Question(data);

  //Guardar DB
  await question.save();

  res.status(201).json(question);
};

const getAllQuestion = async (req, res) => {
  const query = { status: true };
  const [total, questions] = await Promise.all([
    Question.countDocuments(query),
    Question.find(query).populate("user", "name").populate("category", "name"),
  ]);
  res.json({ total, questions });
};

const getQuestionId = async (req, res) => {
  const { id } = req.params;
  const question = await Question.findById(id)
    .populate("user", "name")
    .populate("category", "name");
  return res.json(question);
};

const getQuestionByCategory = async (req, res) => {
  const { id } = req.params;
  const query = { category: id };
  const questiones = await Question.find(query)
    .populate("user", "name")
    .populate("category", "name");
  return res.json(questiones);
};

const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  const question = await Question.findByIdAndUpdate(id, { status: false });
  res.json(question);
};

const questionByUser = async (req, res) => {
  const { id } = req.params;
  const question = await Question.find({ user: { _id: id } });
  return res.json(question);
};

const searchQuestions = async (req, res) => {
  const { message } = req.query;
  const query = { topic: { $regex: message, $options: "i" } };
  const question = await Question.find(query);
  return res.json(question);
};

export {
  NewQuestion,
  getAllQuestion,
  getQuestionId,
  getQuestionByCategory,
  deleteQuestion,
  questionByUser,
  searchQuestions,
};
