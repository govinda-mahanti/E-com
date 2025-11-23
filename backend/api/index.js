import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

import connectDB from "../db/db.js";
import ProductRoute from "./productsRoute.js";

dotenv.config();

// __dirname polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "*", // allow frontend hosted on Vercel/Netlify
  })
);

app.use(express.json());

// Connect MongoDB
await connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Ecom server on Vercel");
});

// Routes
app.use("/api", ProductRoute);

// ❌ REMOVE app.listen()
// Vercel serverless uses export default
export default serverless(app);
