const bootstrap = require("bootstrap");
const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const app = express();
app.use(express.static("public"));
app.use(router);
app.use(express.json());
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "jwp_db",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
    return;
  }
  console.log("Connected to database!");
});

app.get("/", (req, res) => {
  // Menjalankan query SELECT dari tabel mading
  connection.query("SELECT * FROM mading", (error, results) => {
    if (error) {
      console.error("Error executing query:", error.message);
      return;
    }
    res.render("home.ejs", { mading: results });
  });
});

app.get("/tulis-mading", (req, res) => {
  res.render("create-mading.ejs");
});
