import express from "express"
import bodyParser from "body-parser"

//Going to go with an array of objects where the object conatains the "date" attribute to hold the inputted date and the "value" attribute to hold the todo item as the value, this will allow me to use the built in sort method for arrays based on the value for the date attribute in ascending meaning least to greatest
const todoItems = []
const app = express()
const port = 3000

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res)=> {
    res.render("index.ejs")
})

app.post("/submit", (req, res)=>{
    console.log(req.body)
    //decided to push the date as the string provided by the input element of type date and not convert it to a Date object, because when you create a new Date object in JS, it prints out the date in the format 2023-12-15T00:00:00.000Z, and you cant use that value as a value for the input element of type date; instead, I converted them to Date objects in the lambda expression for the sort function
    todoItems.push({date: req.body.date, value: req.body.todoItem})
    //this line actually sorts the array by date, the order is ascending meaning least to greatest; if I wanted it to be descending order(greatest to least) just change the order of the lambda experession from a-b to b-a(this works becuase the sort method rules say that if the value of the subtraction in the lambda expression is positive, then the sorting order is b before a, if the value is zero, the sorting order is let them stay in the same place, if the value is negative, then the sorting order is a before b)
    todoItems.sort((a, b)=> new Date(a.date) - new Date(b.date))
    console.log(todoItems)
    console.log(todoItems[0].date)
})

app.delete("/delete", (req, res)=>{
    let indexOfItemToRemove = todoItems.findIndex(obj => obj.value === req.body.todoItem)
    if(indexOfItemToRemove !== -1)
    {
        todoItems.splice(indexOfItemToRemove, 1)
    }
})

app.listen(port, (req, res)=> {
    console.log(`Listening on port ${port}`)
})
