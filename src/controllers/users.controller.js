import User from "../models/User.js";
import usersHelpers from "../helpers/users.helpers.js";
import "dotenv/config";
import mongoose from "mongoose";
const host = process.env.HOST;
const port = process.env.PORT;

const signupUser = async (req, res) => {
  //Registrar usuario
  const { password, ...payload } = req.body;
  try {
    payload.password = usersHelpers.hashPass(password); //Encriptar la contraseña con la función hashPass que está en users.helpers.js
    const newUser = await User.create(payload);
    return res.status(201).json({ message: "User Created", newUser });
  } catch (error) {
    return res.status(400).json({ message: "User Not Created", error });
  }
};

const getAllUsers = async (_req, res) => {
  //Listar todos los usuarios
  try {
    const allUsers = await User.find(); //Nos retorna todos los usuarios de el documento 'users' en la db
    return res.status(200).json({
      allUsers,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      return res.status(200).json({
        user,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  //if(!req.body.email) return res.status(200).json({success: false, error: 'Not email'});
  //if(!req.body.password) return res.status(200).json({success: false, error: 'Not pass'});
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect credentials",
      });
    } //Verificamos que el usuario exista en la db, buscándolo mediante su email
    const match = usersHelpers.matchPass(user.password, req.body.password); //Nos traemos el helper para comparar la password con el hash de la db
    if (!match) {
      return res.status(401).json({
        message: "Incorrect credentials",
        match,
      }); //Si bcrypt detecta que el la contraseña no coincide con el hash retornamos error 401
    } else {
      const accessToken = usersHelpers.generateJwt(
        user._id,
        user.email,
        user.name
      ); //Helper que genera y retorna el JWT
      const { token } = accessToken;
      return res.status(200).json({ user, token });
    } //devolvemos un json con match en true y el token
  } catch (error) {
    return res.status(400).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const currentUser = async (req, res) => {
  //Traer perfil de usuario mediante los datos del JWT
  if (!req.user) return res.status(200).json({ success: false, user: null });
  return await User.findById(req.user.id)
    .then((user) => {
      res.status(200).json({ success: true, data: user });
    })
    .catch((error) => {
      res.status(200).json({ success: false, error });
    });
};

const updateUser = async (req, res) => {
  if (!req.user) return res.status(200).json({ success: false, user: null });
  const userID = new mongoose.Types.ObjectId(req.user.id);
  console.log("userID" + userID);
  try {
    if (req.file) {
      const update = await User.findOneAndUpdate(
        { id: userID },
        { avatar: `${host}:${port}/public/avatars/${req.file.filename}` },
        { new: true }
      );
      console.log(req.body);
      return res.status(201).json({ message: "Avatar Updated", update });
    }
    const updateData = req.body;
    const update = await User.findOneAndUpdate({ id: userID }, updateData, {
      new: true,
    });
    return res.status(201).json({ message: "User Updated", update });
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, {
    active: false,
    deleted: true,
  });
  res.json(user);
};

const reactiveUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, {
    active: true,
    deleted: false,
  });
  res.json(user);
};

export {
  getAllUsers,
  getUserById,
  signupUser,
  login,
  currentUser,
  updateUser,
  deleteUser,
  reactiveUser,
};
