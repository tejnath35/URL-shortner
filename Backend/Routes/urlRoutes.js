import express from "express";
import { shortenUrl, getAllUrls } from "../Controllers/urlController.js";

import { protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/shorten", protect, shortenUrl);
router.get("/urls", protect, getAllUrls);

export default router;
