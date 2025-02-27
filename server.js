// server.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000;

app.get("/weather", async (req, res) => {
  try {
    const { city } = req.query;
    const response = await axios.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${process.env.API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
