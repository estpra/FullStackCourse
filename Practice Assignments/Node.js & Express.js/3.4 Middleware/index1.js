import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

//this line of code is used to create a body for URL-encoded requests like our form submission, which is what the bodyparser module is used for 
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", (req, res)=>{
  console.log(req.body)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
