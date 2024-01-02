import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

app.get("/about", (req, res) => {
  res.send("<h1>About Me</h1><h3>My name is Bob</h3>");
});

app.get("/contact", (req, res) => {
  res.send("<h1>Contact Me</h1><p>Phone: +1805889NVM</p>");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
