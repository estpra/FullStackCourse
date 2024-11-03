import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];
// let items = []

app.get("/", (req, res) => {
  // Example usage:
  const today = new Date();
  const formattedDate = formatDate(today);
  console.log(formattedDate); // Outputs: mm/dd/yyyy
  console.log(`datePicker: ${req.body.datePicker}`);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", (req, res) => { });

app.post("/delete", (req, res) => { });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}
