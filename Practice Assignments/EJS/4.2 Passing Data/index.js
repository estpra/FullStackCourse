import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

let totalLetters = 0

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", {letterCount: totalLetters})
});

app.post("/submit", (req, res) => {
  console.log(req.body)
  totalLetters = req.body.fName.length + req.body.lName.length
  res.render("index.ejs", {letterCount: totalLetters})
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
