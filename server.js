const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/", (req, res) => res.send("🎧 IndieBeats Audio Backend is running!"));

app.get("/audio", async (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId) return res.status(400).send("Missing videoId");

  const url = `https://www.youtube.com/watch?v=${videoId}`;
  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, {
      quality: "highestaudio",
      filter: "audioonly",
    });

    res.setHeader("Content-Type", "audio/webm");
    ytdl(url, { format, filter: "audioonly", quality: "highestaudio" }).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error streaming audio");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
