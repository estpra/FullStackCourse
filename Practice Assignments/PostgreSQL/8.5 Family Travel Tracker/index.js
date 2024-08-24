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
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

// let users = [
//   { id: 1, name: "Angela", color: "teal" },
//   { id: 2, name: "Jack", color: "powderblue" },
// ];
let users = []

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function checkVisistedForUser(userId){
  const result = await db.query(`SELECT country_code FROM visited_countries where user_id = ${userId}`);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getUsers(){
  try {
  users = await db.query("select * from users");
  } catch(err){
    console.log(err);
  }
  return users.rows;
}

//This does not work, seems like this doesnt work becuase we are trying to call the rows method on the result object and since its async, it doesnt exist yet, so when we call the rows attribute it returns undefined 
// async function getUsers(){
//   return await db.query("select * from users").rows;
// }

app.get("/", async (req, res) => {
  users = await getUsers()
  // console.log(users);
  const countries = await checkVisistedForUser(users[0].id);
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: users[0].color,
  });
});

app.post("/add", async (req, res) => {
  insertCountry(req, res)
});

app.post("/user", async (req, res) => {
  // console.log(req.body.user);
  try{
    currentUserId = req.body.user
    let user = await db.query(`select * from users where id = ${currentUserId}`)
    // console.log(user.rows);
    let usersCountries = await checkVisistedForUser(req.body.user)
    // console.log(usersCountries);
    users = await getUsers()
    res.render("index.ejs", {
      countries: usersCountries,
      total: usersCountries.length,
      users: users,
      color: user.rows[0].color,
    });
  } catch(err){
      res.render("new.ejs");
  }

});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  console.log(req.body.name);
  console.log(req.body.color);
  // let user = await db.query(`select id from users where name = ${req.body.name}`);
  // let userID = user.rows[0].id
  // try{
  // db.query(`insert into users(name, color)values('${req.body.name}', '${req.body.color}')`)
  // } catch(err){
  //     console.log(err);
  // }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

async function insertCountry(req, res){
  // users = users
  //made query be able to accept any case by tunring the input and record from the databse lowercase so it doesnt matter
  let resultArr = await db.query(`select country_code from countries where lower(country_name) like lower('${req.body.country}%')`)
  // If you get in this if statement the country does not exist
  // console.log(resultArr.rows.length);
  //Put a check for resultArr.rows.length's length being 247 becuase for whatever reason, when a user enters an empty string(wihtout a space), instead of returning an empty array with size of 0, it returns 247; an empty string with a space returns 0 so that is handled here well
  const countries = await checkVisisted();
  if(resultArr.rows.length == 0 || resultArr.rows.length == 247){
    // const countries = await checkVisisted();
    res.render("index.ejs", {error: "Country does not exist", total: countries.length, countries: countries, users: users,
    color: "teal"})
  }
  else{
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
    res.render("index.ejs", {error: "Country already added", total: countries.length, countries: countries, users: users,
    color: "teal"})
  }
}
}

async function insertCountryForUser(req, res, ){
  // users = users
  //made query be able to accept any case by tunring the input and record from the databse lowercase so it doesnt matter
  let resultArr = await db.query(`select country_code from countries where lower(country_name) like lower('${req.body.country}%')`)
  // If you get in this if statement the country does not exist
  // console.log(resultArr.rows.length);
  //Put a check for resultArr.rows.length's length being 247 becuase for whatever reason, when a user enters an empty string(wihtout a space), instead of returning an empty array with size of 0, it returns 247; an empty string with a space returns 0 so that is handled here well
  const countries = await checkVisisted();
  if(resultArr.rows.length == 0 || resultArr.rows.length == 247){
    // const countries = await checkVisisted();
    res.render("index.ejs", {error: "Country does not exist", total: countries.length, countries: countries, users: users,
    color: "teal"})
  }
  else{
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
    res.render("index.ejs", {error: "Country already added", total: countries.length, countries: countries, users: users,
    color: "teal"})
  }
}
}