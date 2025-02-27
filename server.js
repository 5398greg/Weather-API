// server.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors"); // Import CORS
const app = express();
const PORT = 3000;

// Allow CORS for all requests
app.use(cors()); // This will fix your CORS issue

app.get("/weather", async (req, res) => {
  try {
    const { city } = req.query;
    const apiKey = process.env.API_KEY;
    const response = await axios.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
