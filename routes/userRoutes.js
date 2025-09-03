import express from "express";

import {
  deleteUser,
  getAllUsers,
  getUserByUsername,
  updateUser,
} from "../controllers/userController.js";
import { login, register } from "../controllers/authController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const routes = express.Router();

routes.get("/", getAllUsers);

routes.route("/:username").get(getUserByUsername);

routes.post("/:id/delete", deleteUser);

routes.post("/update/:id", updateUser);

routes.post("/register", upload.single("image"), register);

routes.post("/login", login);

export default routes;
