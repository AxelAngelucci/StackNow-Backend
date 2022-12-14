import express from "express";
import db from "../db/config.js";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import router from "../routes/index.routes.js";
import userRouter from "../routes/users.routes.js";
import { routerQuestion } from "../routes/question.routes.js";
import { routerCategory } from "../routes/category.routes.js";
import { routerAnswer } from "../routes/answer.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4002;
    this.middlewares();
    this.routes();
    this.conectarDB();
  }

  //Conectar Base de datos
  async conectarDB() {
    await db();
  }

  middlewares() {
    this.app.use(cors("*"));
    this.app.use(morgan("dev"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(router);
    this.app.use("/public", express.static(`${__dirname}/storage`));
    console.log(`${__dirname}/storage`);
  }

  routes() {
    this.app.use("/api/v1", router);
    this.app.use("/api/v1/users", userRouter);
    this.app.use("/api/v1/question", routerQuestion);
    this.app.use("/api/v1/category", routerCategory);
    this.app.use("/api/v1/answer", routerAnswer);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto, ${this.port}`);
    });
  }
}

export { Server };
