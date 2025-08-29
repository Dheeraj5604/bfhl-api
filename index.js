import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // parses application/json

// Fallback middleware to log raw body if JSON parsing fails
app.use((req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    let rawData = '';
    req.on('data', chunk => {
      rawData += chunk.toString();
    });
    req.on('end', () => {
      if (rawData) console.log('Raw data received:', rawData);
      next();
    });
  } else {
    next();
  }
});

// Constants
const FULL_NAME = "john_doe";
const DOB = "17091999"; 
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";

// Helper functions
function isNumber(str) {
  return !isNaN(str) && str.trim() !== "";
}

function alternatingCaps(str) {
  let result = "";
  let upper = true;
  for (let i = 0; i < str.length; i++) {
    result += upper ? str[i].toUpperCase() : str[i].toLowerCase();
    upper = !upper;
  }
  return result;
}

// Routes
app.post("/bfhl", (req, res) => {
  try {
    console.log("👉 Parsed body:", req.body);

    if (!req.body || !req.body.data || !Array.isArray(req.body.data)) {
      return res.status(400).json({
        is_success: false,
        message: 'Request body missing or invalid. Send JSON like {"data": ["1","2","a","@","3"]}'
      });
    }

    const data = req.body.data;

    let even_numbers = [];
    let odd_numbers = [];
    let alphabets = [];
    let special_characters = [];
    let sum = 0;

    data.forEach(item => {
      if (isNumber(item)) {
        const num = parseInt(item, 10);
        sum += num;
        if (num % 2 === 0) even_numbers.push(item);
        else odd_numbers.push(item);
      } else if (/^[a-zA-Z]+$/.test(item)) {
        alphabets.push(item.toUpperCase());
      } else {
        special_characters.push(item);
      }
    });

    const allAlphabets = alphabets.join("");
    const reversed = allAlphabets.split("").reverse().join("");
    const concat_string = alternatingCaps(reversed);

    res.status(200).json({
      is_success: true,
      user_id: `${FULL_NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sum.toString(),
      concat_string
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ is_success: false, message: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("BFHL API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
