import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getAllPostByUserId,
  getPostById,
} from "../controllers/postController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const routes = express.Router();

routes.get("/", getAllPosts);

routes.route("/post/:id").get(getPostById);

routes
  .route("/:userId")
  .get(getAllPostByUserId)
  .post(upload.single("image"), createPost);

routes.delete("/:userId/:id", deletePost);

export default routes;
