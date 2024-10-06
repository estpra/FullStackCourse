import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "King0fDB",
  port: 5432
});
let countries = [];

let total = 0;

db.connect();

// db.query("SELECT * FROM visited_countries", (err, res) => {
//   if (err) {
//     console.error("Error executing query", err.stack);
//   } else {
//     countries = res.rows;
//     console.log(countries);
//     console.log(countries[0].country_code);
//     let tempArray = [];
//     let i = 0;
//     countries.forEach(element => {
//         tempArray[i] = element.country_code;
//         i++;
//     });
//     countries = tempArray;
//     console.log(countries);
//   }
//   // db.end();
// });

// function formatQuery(queryResult){
//     let tempArray = [];
//     let i = 0;
//     queryResult.forEach(element => {
//         tempArray[i] = element.country_code;
//         i++;
//     });
//     queryResult = tempArray;
//     next()
// }

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use(formatQuery(countries));

app.get("/", async (req, res)=>{
  //Original implementation
  // const result = await db.query("SELECT * FROM visited_countries");
  // countries = result.rows;
  // console.log(countries);
  // console.log(countries[0].country_code);
  // let tempArray = [];
  // let i = 0;
  // countries.forEach(element => {
  //       tempArray[i] = element.country_code;
  //       i++;
  //     });
  // countries = tempArray;
  // console.log(countries)
  countries = await getVisitedCountries()
  console.log(countries);
  res.render("index.ejs", { countries: countries, total: countries.length });
});

// app.post("/add", async (req, res)=>{
//   let response;
//   //made query be able to accept any case by tunring the input and record from the databse lowercase so it doesnt matter
//   let result = await db.query(`select country_code from countries where lower(country_name) like lower('${req.body.country}%')`)
//   let countryCode = result.rows[0].country_code
//   // console.log(countryCode);
//   db.query(`INSERT INTO visited_countries(country_code) values('${countryCode}');`, (err, res) => {
//     if (err) {
//       console.error("Error executing query", err);
//     } else {
//       response = res.rows
//       console.log(response);
//     }
//     // db.end();
//   });
//   // res.render("index.ejs", {countries: countries, total: total});
//   res.redirect("/");
// });

// app.post("/add", async (req, res)=>{
//   let result = await db.query(`select country_code from countries where lower(country_name) like lower('${req.body.country}%')`)
//   let countryCode = result.rows[0].country_code
//   let countryCodeArr = await db.query(`select * from visited_countries where country_code like upper('${countryCode}%')`)
//   console.log(countryCodeArr.rows.length);
//   res.redirect("/");
// });


app.post("/add", async (req, res)=>{
  //made query be able to accept any case by tunring the input and record from the databse lowercase so it doesnt matter
  // let result = await db.query(`select country_code from countries where lower(country_name) like lower('${req.body.country}%')`)
  // doesCountryExist(result, res)
  // let countryCode = result.rows[0].country_code
  // console.log(req.body.country);
  insertCountry(req, res)
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// async function doesCountryExist(result, res){
//   if(result.rows.length == 0){
//     res.render("index.ejs", {error: "Country does not exist", total: total, countries: countries})
//   }
// }

async function getVisitedCountries(){
  const result = await db.query("SELECT * FROM visited_countries");
  let countries = result.rows;
      // console.log(countries);
      // console.log(countries[0].country_code);
      let tempArray = [];
      let i = 0;
      countries.forEach(element => {
        tempArray[i] = element.country_code;
        i++;
      });
      countries = tempArray;
      return countries
}

async function insertCountry(req, res){
  //made query be able to accept any case by tunring the input and record from the databse lowercase so it doesnt matter
  let resultArr = await db.query(`select country_code from countries where lower(country_name) like lower('${req.body.country}%')`)
  // If you get in this if statement the country does not exist
  // console.log(resultArr.rows.length);
  //Put a check for resultArr.rows.length's length being 247 becuase for whatever reason, when a user enters an empty string(wihtout a space), instead of returning an empty array with size of 0, it returns 247; an empty string with a space returns 0 so that is handled here well
  if(resultArr.rows.length == 0 || resultArr.rows.length == 247){
    res.render("index.ejs", {error: "Country does not exist", total: total, countries: countries})
  }
  else {
  let countryCode = resultArr.rows[0].country_code
  let result = await db.query(`select * from visited_countries where country_code like upper('${countryCode}%')`)
  if(result.rows.length == 0){
    let countryCodeArr = await db.query(`select country_code from countries where lower(country_name) like lower('${req.body.country}%')`)
    let countryCode = countryCodeArr.rows[0].country_code
    db.query(`INSERT INTO visited_countries(country_code) values('${countryCode}');`, (err, res) => {
      if (err) {
        console.error("Error executing query", err);
      } else {
        // let response = res.rows
        // console.log(response);
      }
      // db.end();
    });
    res.redirect("/")
  }
  else{
    res.render("index.ejs", {error: "Country already added", total: total, countries: countries})
  }
}
}