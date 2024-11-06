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
  // const today = new Date();
  // const dateStr = formatDate(today);
  // console.log(dateStr); // Outputs: mm/dd/yyyy
  // const dateObj = convertStrToDate(dateStr)
  console.log(`datePicker: ${req.body.datePicker}`);
  // let dateStr = "2024-11-10"
  let dateStr = ""
  res.render("index.ejs", {
    listTitle: dateStr,
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  console.log(`datePicker: ${req.body.datePicker}`);
  items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", (req, res) => { });

app.post("/delete", (req, res) => { });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


function formatDate(date){
  // Get today's date
    console.log(new Date().toISOString());
    const today = new Date().toISOString().split('T')[0];

    return today;
}

// function formatDate(date) {
//   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//   const day = String(date.getDate()).padStart(2, '0');
//   const year = date.getFullYear();
//   return `${month}/${day}/${year}`;
// }

// function convertStrToDate(dateString) {
//   // Split the string into day, month, and year components
//   const [day, month, year] = dateString.split('/').map(Number);
//   // Adjust the month value (subtract 1 because JavaScript uses zero-based indexing)
//   const adjustedMonth = month - 1;
//   // Create a new Date object
//   return new Date(year, adjustedMonth, day);
// }