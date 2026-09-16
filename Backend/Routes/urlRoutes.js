import express from "express";
import { shortenUrl, getAllUrls, deleteUrl, updateUrl } from "../Controllers/urlController.js";

import { protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/shorten", protect, shortenUrl);
router.get("/urls", protect, getAllUrls);
router.delete("/urls/:id", protect, deleteUrl);
router.put("/urls/:id", protect, updateUrl);

export default router;
