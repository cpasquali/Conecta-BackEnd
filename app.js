import express from "express";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentsRoutes.js";
import postLikesRoutes from "./routes/postLikesRoutes.js";
import userFollowersRoutes from "./routes/userFollowers.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

console.log(process.env.MYSQL_URL);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Server andando" });
});

app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/likes", postLikesRoutes);
app.use("/userFollowers", userFollowersRoutes);

app.listen(3000, () => {
  console.log(3000, "Servidor conectado en el puerto http://localhost:3000");
});
