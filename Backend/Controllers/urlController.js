import Url from "../Models/Url.js";

const normalizeUrl = (longUrl) => {
  const trimmed = longUrl.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const isValidUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const generateCode = () => {
  return Math.random().toString(36).slice(2, 8);
};

const getBaseUrl = (req) => {
  // Prefer an explicit Render URL if configured.
  if (process.env.RENDER_URL) {
    return process.env.RENDER_URL.replace(/\/$/, "");
  }

  if (process.env.BASE_URL && !process.env.BASE_URL.includes("localhost") && !process.env.BASE_URL.includes("127.0.0.1")) {
    return process.env.BASE_URL.replace(/\/$/, "");
  }

  // Fallback to request host if env vars are missing or when running locally.
  const host = req.get("host");
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  return `${protocol}://${host}`;
};

const normalizeTags = (tags) => [...new Set((Array.isArray(tags) ? tags : [])
  .map((tag) => String(tag).trim().toLowerCase())
  .filter(Boolean))].slice(0, 8);

const parseExpiry = (expiresAt) => {
  if (!expiresAt) return null;
  const date = new Date(expiresAt);
  return Number.isNaN(date.getTime()) || date <= new Date() ? null : date;
};

export const shortenUrl = async (req, res) => {
  const { longUrl, customCode, title, tags, expiresAt } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "Missing longUrl field" });
  }

  const normalizedUrl = normalizeUrl(longUrl);

  if (!isValidUrl(normalizedUrl)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  try {
    let code = customCode;

    if (code) {
      if (!/^[a-zA-Z0-9_-]{2,20}$/.test(code)) {
        return res.status(400).json({ error: "Custom code must be 2-20 characters and contain only letters, numbers, hyphens, or underscores" });
      }

      const codeExists = await Url.findOne({ code });
      if (codeExists) {
        return res.status(409).json({ error: "This code is already taken" });
      }
    }

    if (!code) {
      code = generateCode();
      while (await Url.findOne({ code })) {
        code = generateCode();
      }
    }

    const existing = await Url.findOne({ longUrl: normalizedUrl, user: req.user._id });
    if (existing && !customCode) {
      const existingObject = existing.toObject();
      existingObject.shortUrl = `${getBaseUrl(req)}/${existingObject.code}`;
      return res.status(200).json(existingObject);
    }

    const shortUrl = `${getBaseUrl(req)}/${code}`;
    const url = await Url.create({
      longUrl: normalizedUrl,
      shortUrl,
      code,
      user: req.user._id,
      title: String(title || "").trim().slice(0, 80),
      tags: normalizeTags(tags),
      expiresAt: parseExpiry(expiresAt),
    });
    const urlObject = url.toObject();
    urlObject.shortUrl = shortUrl;

    return res.status(201).json(urlObject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error creating short URL" });
  }
};

export const getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(urls);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error loading URLs" });
  }
};

export const redirectUrl = async (req, res) => {
  const { code } = req.params;

  if (!code) {
    return res.status(400).json({ error: "Missing URL code" });
  }

  try {
    const url = await Url.findOne({ code });
    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }
    if (url.expiresAt && url.expiresAt <= new Date()) {
      return res.status(410).send("This short link has expired.");
    }
    await Url.updateOne({ _id: url._id }, { $inc: { clicks: 1 }, $set: { lastClickedAt: new Date() } });
    return res.redirect(url.longUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error redirecting" });
  }
};

export const updateUrl = async (req, res) => {
  const { id } = req.params;
  const { longUrl, title, tags, expiresAt } = req.body;

  if (!id) return res.status(400).json({ error: "Missing URL ID" });

  try {
    const updates = {
      title: String(title || "").trim().slice(0, 80),
      tags: normalizeTags(tags),
      expiresAt: parseExpiry(expiresAt),
    };

    if (longUrl) {
      const normalizedUrl = normalizeUrl(longUrl);
      if (!isValidUrl(normalizedUrl)) return res.status(400).json({ error: "Invalid URL format" });
      updates.longUrl = normalizedUrl;
    }

    const url = await Url.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updates,
      { new: true, runValidators: true },
    );

    if (!url) return res.status(404).json({ error: "URL not found or unauthorized" });
    return res.json(url);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error updating URL" });
  }
};

export const deleteUrl = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing URL ID" });
  }

  try {
    const url = await Url.findOne({ _id: id, user: req.user._id });

    if (!url) {
      return res.status(404).json({ error: "URL not found or unauthorized" });
    }

    await Url.deleteOne({ _id: id });
    return res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error deleting URL" });
  }
};
