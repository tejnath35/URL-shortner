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

const getBaseUrl = () => {
  return process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
};

export const shortenUrl = async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "Missing longUrl field" });
  }

  const normalizedUrl = normalizeUrl(longUrl);

  if (!isValidUrl(normalizedUrl)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  try {
    const existing = await Url.findOne({ longUrl: normalizedUrl, user: req.user._id });
    if (existing) {
      return res.status(200).json(existing);
    }

    let code = generateCode();
    while (await Url.findOne({ code })) {
      code = generateCode();
    }

    const shortUrl = `${getBaseUrl()}/${code}`;
    const url = await Url.create({ longUrl: normalizedUrl, shortUrl, code, user: req.user._id });

    return res.status(201).json(url);
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
    return res.redirect(url.longUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error redirecting" });
  }
};
