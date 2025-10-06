import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/proxy", async (req, res) => {
  const baseUrl = req.query.url;
  if (!baseUrl || !baseUrl.startsWith("http://")) return res.status(400).send("Invalid URL");

  const params = {...req.query};
  delete params.url;
  const fullUrl = baseUrl + (Object.keys(params).length ? (baseUrl.includes('?') ? '&' : '?') + new URLSearchParams(params).toString() : '');

  try {
    const r = await fetch(fullUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    const text = await r.text();
    res.send(text);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).send("Error fetching URL: " + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy läuft auf Port ${PORT}`));
