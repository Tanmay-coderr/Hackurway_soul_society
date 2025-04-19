import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

const app = express();
app.use(express.json()); // or urlencoded, if needed

const PORT = process.env.PORT || 5000;

// ✅ Async function to connect DB
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ MongoDB connected successfully");
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error.message);
      process.exit(1);
    }
  };
  

// 🏁 Start server only after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
