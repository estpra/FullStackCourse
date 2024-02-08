import express from "express"
import bodyParser from "body-parser"
import axios from "axios"

const app = express()
const port = 3000
const API_URL = " https://v2.jokeapi.dev"
let categories = []

//decided to make this function/ middleware since I am going to be making calls to the categories endpoint for each of the endpoints that I'm going to make a server side request anyway
async function getCategories(req, res, next) {
    const result = await axios.get(`${API_URL}/categories`)
    categories = result.data.categories
    console.log(categories);
    next()
}

app.use(getCategories)
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", async (req, res) => {
    // const result = await axios.get(`${API_URL}/categories`)
    // console.log(result.data.categories);
    // res.render("index.ejs", {categories: result.data.categories})
    res.render("index.ejs", { categories: categories })
})

app.get("/getJoke", async (req, res) => {
    try{
    //In order to be able to see the data sent over from a form that send a GET request, you must use req.query not req.body, this is because In a GET request, form data is appended to the URL as query parameters rather than being sent in the body of the request
    // console.log(req.query);
    // console.log(req.query.categories);
    const result = await axios.get(`${API_URL}/joke/${req.query.categories}`)
    // console.log(result);
    res.render("index.ejs", { categories: categories, joke: result.data })
    }catch (error) {
        console.log(error.response.data);
        // res.render("index.ejs", { content: error.response.data });
      }
})

app.post("/addJoke", async (req, res) => {
    try{
    console.log(req.body);
    const jokePayload = {
        "formatVersion": 3,
        "category": "Misc",
        "type": "single",
        "joke": `${req.body.createJoke}`,
        "flags": {
            "nsfw": true,
            "religious": false,
            "political": false,
            "racist": false,
            "sexist": false,
            "explicit": false
        },
        "lang": "en"
    }
    const result = await axios.get(`${API_URL}/submit`, jokePayload)
    console.log(result.data);
}
    catch (error) {
        console.log(error.response.data);
        // res.render("index.ejs", { content: error.response.data });
      }
    // res.render("index.ejs", {categories: categories})
})

app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`);
})