import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import urlRoutes from "./Routes/urlRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import { redirectUrl } from "./Controllers/urlController.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, "../Frontend/dist");
const frontendIndexPath = path.join(frontendDistPath, "index.html");
const hasFrontendBuild = fs.existsSync(frontendIndexPath);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

if (hasFrontendBuild) {
  app.use(express.static(frontendDistPath));
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api", urlRoutes);

app.get("/:code", (req, res, next) => {
  const { code } = req.params;
  if (/^[A-Za-z0-9]{6}$/.test(code)) {
    return redirectUrl(req, res, next);
  }
  return next();
});

if (!hasFrontendBuild) {
  app.get("/", (req, res) => {
    res.send("URL Shortener API is running");
  });
}

app.get("*", (req, res, next) => {
  if (req.method !== "GET") {
    return next();
  }

  if (req.path.startsWith("/api")) {
    return next();
  }

  if (!hasFrontendBuild) {
    return res.status(404).send("Route not found");
  }

  res.sendFile(frontendIndexPath, (err) => {
    if (err) {
      next(err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
