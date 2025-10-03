import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectMongoose } from "./db/connection.js";
// import authRoutes from "./routes/authRoute.js";
// import userRoutes from "./routes/userRoute.js";
import students from "./routes/studentRoute.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Routes
// app.use("/auth", authRoutes);
// app.use("/user", userRoutes);
app.use("/student", students);

// Start after DB connect
// using user database
try {
  await connectMongoose(process.env.ATLAS_URI);
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`)
  });
} catch (err) {
  process.exit(1); // exit if DB connection failed
}