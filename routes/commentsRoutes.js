import express from "express";
import {
  createComment,
  getCommentPost,
} from "../controllers/commentsController.js";

const routes = express.Router();

routes.get("/:postId", getCommentPost);

routes.post("/:postId/:userId", createComment);

export default routes;
