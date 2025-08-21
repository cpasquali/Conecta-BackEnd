import express from "express";
import {
  addFollow,
  getUserFollowing,
  removeFollower,
} from "../controllers/userFollowersController.js";

const routes = express.Router();

routes.get("/following/:id_user_follower", getUserFollowing);

routes
  .route("/:id_user_following/:id_user_follower")
  .post(addFollow)
  .delete(removeFollower);

export default routes;
