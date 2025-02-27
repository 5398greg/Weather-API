require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/weather", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const apiKey = process.env.API_KEY;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}`;
    const response = await axios.get(url);

    res.json(response.data);
  } catch (error) {
    console.error("Weather API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
