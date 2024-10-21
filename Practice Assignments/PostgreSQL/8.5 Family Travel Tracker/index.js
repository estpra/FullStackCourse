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

//initializing currentUserId to 1 so it can alwyas render the first entry in visited_countries table when the webpage is first run
//changed this to default to using the getRandomUderId function as there may not be a user with the id of 1
let currentUserId = await getRandomUserId();
let users = []

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function checkVisistedForUser(userId) {
  try{
  const result = await db.query(`SELECT country_code FROM visited_countries where user_id = ${userId}`);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
catch(err){
  console.log(err);
}
}

async function getUsers() {
  try {
    users = await db.query("select * from users");
  } catch (err) {
    console.log(err);
  }
  return users.rows;
}

async function getRandomUserId(){
  try{
    let result = await db.query("select id from users")
    //Had to add this if else statement cuz if web app is started off from scratch, when the query is ran and we get back an empty array, nothing is added to userIds array so the length is zero and so is the index, but since userIds is empty, when we try indexing we get null(or undefined) which caused the app to crash, so if the query above returns a list of size zero, return zero so the web app wont crash
    if(result.rows.length != 0){
    let userIds = []
    result.rows.forEach((user) => {
      userIds.push(user.id);
    });
    let ranIndex = parseInt(Math.random() * userIds.length)
    return userIds[ranIndex]
  }
  else{
    return 0
  }
  }
  catch (err){
console.log(err);
  }
}

//This does not work, seems like this doesnt work becuase we are trying to call the rows method on the result object and since its async, it doesnt exist yet, so when we call the rows attribute it returns undefined 
// async function getUsers(){
//   return await db.query("select * from users").rows;
// }

app.get("/", async (req, res) => {
  users = await getUsers()
  // console.log(users);
  //using currentUserId so whatever current user tab is selected or first user can be rendered until a new user tab is selected
  const countries = await checkVisistedForUser(currentUserId);
  let currUser = await db.query(`select * from users where id = ${currentUserId}`)
  //Added lines 78-84 to handle case where there are no users added yet since it would crash since there wasnt a color for no users
  let color
  if(currUser.rows.length == 0){
    color = ""
  }
  else{
    color = currUser.rows[0].color
  }
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: color,
    // color: currUser.rows[0].color,
  });
});

//This enpoint is used to add new countires to existing users
app.post("/add", async (req, res) => {
  insertCountry(req, res)
});

//This endpoint displays the visited countries for the user tab clicked or opens the new.ejs page
app.post("/user", async (req, res) => {
  // console.log(req.body.user);
  try {
    // currentUserId = req.body.user
    //Had to put this query here so I can get an exception and go to the catch block to render the new.ejs page
    let user = await db.query(`select * from users where id = ${req.body.user}`)
    currentUserId = user.rows[0].id
    res.redirect("/")
    // console.log("try");
    //All the code commented out below seems to be replaceable with res.redirect("/") becuase the "/" endpoint handles all of the operations executed here, all I have to do is reassign currentUserId to the current user tab that was selected
    // let user = await db.query(`select * from users where id = ${currentUserId}`)
    // console.log(user.rows);
    // let usersCountries = await checkVisistedForUser(currentUserId)
    // console.log(usersCountries);
    // res.render("index.ejs", {
    //   countries: usersCountries,
    //   total: usersCountries.length,
    //   users: users,
    //   color: user.rows[0].color,
    // });
  } catch (err) {
    // console.log("catch");
    res.render("new.ejs");
  }

});

//Will have to set the currentUserId to a user that actually exists cuz the way we currently have this setup is to set cuyrrentUserId to the last user tab a user clicked on so this would crash the app, thinking about making a function that gets a lost of current existing user Ids and choosing one of them randomly
app.post("/delete", async (req, res) => {
  try{
    db.query(`delete from visited_countries where user_id = ${currentUserId}`)
    db.query(`delete from users where id = ${currentUserId};`)
    currentUserId = await getRandomUserId()
    res.redirect("/")
  } catch(err){
    console.log(err);
  }
})

//This endpoint is used to add a new user to the users table, can use the returning keyword to get the id assigned to the newly added user to assign to currentUserId
app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  // console.log(req.body.name);
  // console.log(req.body.color);
  //Seems like I can still use this line of code to make sure that the new user that is being added doesnt already exist
  let user = await db.query(`select * from users where name = '${req.body.name}'`);
  if (user.rows.length == 0) {
    try {
      let newUserId = await db.query(`insert into users(name, color) values('${req.body.name}', '${req.body.color}') returning id`)
      console.log(newUserId.rows[0].id);
      currentUserId = newUserId.rows[0].id
      //Either this res.redirect will work or will probably need to manually enter a res.render that passes in an empty array for the visited countires array
      res.redirect("/")
      // users = await getUsers();
      // res.render("index.ejs", {
      //   countries: countries,
      //   total: countries.length,
      //   users: users,
      //   color: users[0].color,
      // })
    } catch (err) {
      console.log(err);
    }
  }
  else {
    currentUserId = user.rows[0].id;
    res.redirect("/");
    // let usersCountries = await checkVisistedForUser(user.rows[0].id)
    // res.render("index.ejs", {
    //   error: "Country already added for user", total: usersCountries.length, countries: usersCountries, users: users,
    //   color: "teal"
    // })
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

async function insertCountry(req, res) {
  //made query be able to accept any case by tunring the input and record from the databse lowercase so it doesnt matter
  let resultArr = await db.query(`select country_code from countries where lower(country_name) like lower('${req.body.country}%')`)
  // console.log(resultArr.rows.length);
  // If you get in this if statement the country does not exist
  //Put a check for resultArr.rows.length's length being 247 becuase for whatever reason, when a user enters an empty string(wihtout a space), instead of returning an empty array with size of 0, it returns 247; an empty string with a space returns 0 so that is handled here well
  if (resultArr.rows.length == 0 || resultArr.rows.length == 247) {
    let user = await db.query(`select * from users where id = ${currentUserId}`)
    let usersCountries = await checkVisistedForUser(user.rows[0].id)
    res.render("index.ejs", {
      error: "Country does not exist", total: usersCountries.length, countries: usersCountries, users: users,
      color: user.rows[0].color
    })
  }
  else {
    //The current country that will be added to current user if it hasnt already been added to current user
    let countryCode = resultArr.rows[0].country_code
    //Might not need this query since we need to add a new user at this point, but maybe cuz this function still needs to be used to add countires to existing users and perform the logic to see if a country already exists for a given user; need to verify which path is used when a user submits the form for adding a country to a user 
    let result = await db.query(`select * from visited_countries where country_code like upper('${countryCode}%') and user_id = ${currentUserId}`)
    if (result.rows.length == 0) {
      //This seems to be a duplicate from the resultArr query made in the beginning of this function, most likely removing this
      // let countryCodeArr = await db.query(`select country_code from countries where lower(country_name) like lower('${req.body.country}%')`)
      // let countryCode = countryCodeArr.rows[0].country_code
      //Make currentUserId equal to the id of the newly created user; everything else should work fine the way it is
      db.query(`INSERT INTO visited_countries(country_code, user_id) values('${countryCode}', ${currentUserId});`, (err, res) => {
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
    else {
      let user = await db.query(`select * from users where id = ${currentUserId}`)
      let usersCountries = await checkVisistedForUser(user.rows[0].id)
      res.render("index.ejs", {
        error: "Country already added for user", total: usersCountries.length, countries: usersCountries, users: users,
        color: user.rows[0].color
      })
    }
  }
}

async function insertCountryForUser(req, res) {
  // users = users
  //made query be able to accept any case by tunring the input and record from the databse lowercase so it doesnt matter
  let resultArr = await db.query(`select country_code from countries where lower(country_name) like lower('${req.body.country}%')`)
  // If you get in this if statement the country does not exist
  // console.log(resultArr.rows.length);
  //Put a check for resultArr.rows.length's length being 247 becuase for whatever reason, when a user enters an empty string(wihtout a space), instead of returning an empty array with size of 0, it returns 247; an empty string with a space returns 0 so that is handled here well
  const countries = await checkVisisted();
  if (resultArr.rows.length == 0 || resultArr.rows.length == 247) {
    // const countries = await checkVisisted();
    res.render("index.ejs", {
      error: "Country does not exist", total: countries.length, countries: countries, users: users,
      color: "teal"
    })
  }
  else {
    let countryCode = resultArr.rows[0].country_code
    let result = await db.query(`select * from visited_countries where country_code like upper('${countryCode}%')`)
    if (result.rows.length == 0) {
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
    else {
      res.render("index.ejs", {
        error: "Country already added", total: countries.length, countries: countries, users: users,
        color: "teal"
      })
    }
  }
}