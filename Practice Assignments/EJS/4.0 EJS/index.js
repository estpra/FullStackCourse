import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express()
const port = 3000

//getDate() returns 0(sunday)-6(saturday)
let currentDay = new Date().getDay()

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})

app.get("/", (req, res)=> {
    res.render("index.ejs",
    {day: currentDay})
})