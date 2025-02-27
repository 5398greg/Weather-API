// // server.js
// require("dotenv").config();
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors"); // Import CORS
// const app = express();
// const PORT = 3000;

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// // Allow CORS for all requests
// app.use(cors());

// app.get("/weather", async (req, res) => {
//   try {
//     const { city } = req.query;
//     const apiKey = process.env.API_KEY;
//     const response = await axios.get(
//       `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}`
//     );
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch weather data" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
app.options("*", cors()); // Handle pre-flight CORS requests

// 🔥 CORS Middleware (100% Bulletproof Fix)
app.use(
  cors({
    origin: "*", // Allow requests from any origin
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
  })
);

app.get("/weather", async (req, res) => {
  try {
    const { city } = req.query;
    const apiKey = process.env.API_KEY;
    const response = await axios.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch weather data", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
