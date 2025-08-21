import express from "express";
import {
  getUserPostLike,
  addPostLike,
  deletePostLike,
} from "../controllers/postLikesController.js";

const routes = express.Router();

routes
  .route("/:post_id/:user_id")
  .get(getUserPostLike)
  .post(addPostLike)
  .delete(deletePostLike);

export default routes;
