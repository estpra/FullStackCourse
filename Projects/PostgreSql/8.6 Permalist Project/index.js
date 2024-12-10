import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todo_items",
  password: "King0fDB",
  port: 5432
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = []
let dateStr = ""

app.get("/", async (req, res) => {
  // let today = new Date();
  // console.log(today);
  //added this if statement to be able to use dateStr as a global variable and be able to use res.redirect on the other endpoints
  if (dateStr == "") {
    let today = new Date();
    dateStr = today.toLocaleDateString();
    //added these 2 lines of code to keep the format as yyyy-mm-dd due to issue I was having where when user wanted to see the items for a specific date, it would get the incorrect date, for ex, in my case, since I am on pacfic time, the toLocaleDateString() method would convert the date to one day less than the date I actually wanted
    let timeZoneAccurateDate = new Date(dateStr)
    dateStr = timeZoneAccurateDate.toISOString().split('T')[0];
  }
  // let dateStr = today.toISOString().split('T')[0]
  // const dateStr = formatDate(today);
  console.log(`dateStr: ${dateStr}`);
  // const dateObj = convertStrToDate(dateStr)
  // console.log(`datePicker: ${req.body.datePicker}`);
  let itemsArr = await db.query(`select title from items where date_of_items = '${dateStr}'`)
  console.log(itemsArr.rows);
  //No need to get the raw data itself as the listItems attribute is an array of objects
  items = itemsArr.rows
  console.log(dateStr);
  res.render("index.ejs", {
    listTitle: dateStr,
    listItems: items,
  });
});

//Seems like this endpoint will have to handle both adding a new todo item and getting the todo items for a given date; have to do it like this since you can't nest forms within eachother, only the outer form is executed
app.post("/add", async (req, res) => {
  let currDate = new Date(req.body.datePicker)
  //dont need to use toLocaleDateString() method here cuz the date selected from the input of type date is the actual date the user wants to see, if we use toLocaleDateString() then it converts it to a day prior in our case since UTC time is a day ahead of pacific
  dateStr = currDate.toISOString().split('T')[0];
  console.log(`dateStr: ${dateStr}`);
  let newItem = req.body.newItem;
  console.log(`newItem: ${newItem}`);
  //If you get in this if statement, you are just getting the todo items for the inputted date
  if (newItem == "") {
    console.log(`datePicker: ${req.body.datePicker}`);
    console.log("On the right track");
    res.redirect("/")
  }
  else {
    //TODO: add if statement that checks if the item variable is an empty string and if it is, dont push the item to the items array
    await db.query(`insert into items(date_of_items, title) values('${dateStr}', '${newItem}')`)
    res.redirect("/");
  }
});

app.post("/edit", (req, res) => {
  console.log("Should be here");
  console.log(`updatedItemTitle: ${req.body.updatedItemTitle}`);
  
});

app.post("/delete", (req, res) => { 

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// function formatDate(date){
//   // Get today's date
//     console.log(new Date().toISOString());
//     const today = new Date().toISOString().split('T')[0];

//     return today;
// }

function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// function convertStrToDate(dateString) {
//   // Split the string into day, month, and year components
//   const [day, month, year] = dateString.split('/').map(Number);
//   // Adjust the month value (subtract 1 because JavaScript uses zero-based indexing)
//   const adjustedMonth = month - 1;
//   // Create a new Date object
//   return new Date(year, adjustedMonth, day);
// }