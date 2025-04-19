// index.js
import express from "express";
import dotenv from "dotenv";
import { signupUser, loginUser } from "../controllers/authController.js";



dotenv.config();
const app = express();
app.use(express.json());

app.post("/api/signup", signupUser);
app.post("/api/login", loginUser);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
