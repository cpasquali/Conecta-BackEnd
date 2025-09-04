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

routes.post("/login", login);

routes.post("/register", upload.single("image"), register);

routes.post("/:id/delete", deleteUser);

routes.patch("/update/:id", upload.single("image"), updateUser);

routes.route("/:username").get(getUserByUsername);

export default routes;
