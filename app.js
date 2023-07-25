const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const app = express();
const multer = require("multer");
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
    return;
  }
  console.log("Connected to database!");
});

app.get("/", (req, res) => {
  connection.query(
    "SELECT * FROM mading ORDER BY waktu DESC",
    (error, results) => {
      if (error) {
        console.error("Error executing query:", error.message);
        return;
      }
      res.render("home.ejs", { mading: results });
    }
  );
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.post("/login", (req, res) => {
  const uname = req.body.uname;
  connection.query(
    "SELECT * FROM users WHERE uname = ?",
    [uname],
    (error, results) => {
      // Pisahkan proses berdasarkan banyaknya element-element dalam array `results`
      if (results.length > 0) {
        if (req.body.password === results[0].password) {
          console.log("Autentikasi berhasil");
          res.redirect("/");
        } else {
          console.log("Autentikasi gagal");
          res.redirect("/login");
        }
      } else {
        res.redirect("/login");
      }
    }
  );
});

app.get("/tulis-mading", (req, res) => {
  res.render("tulis-mading.ejs");
});

app.post("/tulis-mading", upload.single("image"), (req, res) => {
  console.log(req.body);
  console.log(req.file.filename);
  const judul = req.body.madingJudul;
  const isi = req.body.madingIsi;
  const thumbnail = req.file.filename;

  connection.query(
    `INSERT INTO mading (judul, isi, thumbnail) VALUES (?,?, ?)`,
    [judul, isi, thumbnail],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/");
      }
    }
  );
});
