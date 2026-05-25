import express from "express";
import { registerUser, loginUser, updateProfile } from "../Controllers/authController.js";
import { protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", protect, updateProfile);

export default router;
