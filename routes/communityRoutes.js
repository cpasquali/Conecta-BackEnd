import express from "express";
import {
  getAllCommunitys,
  createCommunity,
} from "../controllers/communityController.js";

const routes = express.Router();

routes.get("/", getAllCommunitys);
routes.post("/", createCommunity);

export default routes;
