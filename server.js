import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/proxy", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Missing url");

  try {
    const response = await fetch(target);
    const contentType = response.headers.get("content-type") || "text/html";
    res.setHeader("Content-Type", contentType);
    const body = await response.text();
    res.send(body);
  } catch (err) {
    res.status(500).send("Proxy error");
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Proxy running on port " + PORT));
