const express = require("express");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.PORT;

// Load Google API credentials
const credentials = JSON.parse(fs.readFileSync("google-credentials.json"));
const client = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth: client });

// Google Sheet ID (replace with your actual Sheet ID)
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = "Expenses";

app.post("/add-expense", async (req, res) => {
  const { category, amount, date } = req.body;
  
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:C`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[date, category, amount]],
      },
    });

    res.json({ success: true, message: "Expense added successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
