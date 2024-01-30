import express from "express"
import bodyParser from "body-parser"

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, (req, res)=> {
    console.log(`Listening on port ${port}`);
})