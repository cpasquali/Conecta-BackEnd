import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getAllPostByUserId,
  getPostById,
} from "../controllers/postController.js";

const routes = express.Router();

routes.get("/", getAllPosts);

routes.route("/post/:id").get(getPostById);

routes.route("/:userId").get(getAllPostByUserId).post(createPost);

routes.delete("/:userId/:id", deletePost);

export default routes;
