import express from "express"
import bodyParser from "body-parser"

//Going to go with an array of objects where the object conatains the "date" attribute to hold the inputted date and the "value" attribute to hold the todo item as the value, this will allow me to use the built in sort method for arrays based on the value for the date attribute in ascending meaning least to greatest
const todoItems = []
// Used this test data with the array to make sure it was working how i wanted, can uncomment it out to use the test data for testing purposes, just make sure to comment out the empty todoItems array
// const todoItems = [
    //Keep in mind that the id attribute will be an int not a string in my production version, just keeping it as a string for now; when it comes to the production version, I will parse the value of the hidden input field to an int(Got ahead of myself and already turned them to ints before pushing to git lol) 
//     {id: 0, date: "2023-12-14", value: "Test1"},
//     {id: 1, date: "2023-12-18", value: "Test2"},
//     {id: 2, date: "2023-12-16", value: "Test3"},
//     {id: 3, date: "2023-12-15", value: "Test4"}
// ]
//this variable keeps track of the unique id numbers assigned to each todo item by incrementing it by 1 after creating and adding a new todo item to to todoItems array
//this variable will also be used as the value for the hidden input field 
let idNum = 0
const app = express()
const port = 3000

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//Thinking about sending the todItems array to the front end in this endpoint
app.get("/", (req, res)=> {
    // res.render("index.ejs")
    //thinking this is how the final res.render will look like to pass in the todoItems array to the front end; note that we have to send a JS object as a response, hence why I put the todoItems array as the value of the items attribute of the JS object that is being sent over as a response
    res.render("index.ejs", {items: todoItems})
    console.log(todoItems)
})

app.post("/submit", (req, res)=>{
    // console.log(req.body)
    //decided to push the date as the string provided by the input element of type date and not convert it to a Date object, because when you create a new Date object in JS, it prints out the date in the format 2023-12-15T00:00:00.000Z, and you cant use that value as a value for the input element of type date; instead, I converted them to Date objects in the lambda expression for the sort function
    todoItems.push({id: idNum, date: req.body.date, value: req.body.todoItem})
    //this line actually sorts the array by date, the order is ascending meaning least to greatest; if I wanted it to be descending order(greatest to least) just change the order of the lambda experession from a-b to b-a(this works becuase the sort method rules say that if the value of the subtraction in the lambda expression is positive, then the sorting order is b before a, if the value is zero, the sorting order is let them stay in the same place, if the value is negative, then the sorting order is a before b)
    todoItems.sort((a, b)=> new Date(a.date) - new Date(b.date))
    // console.log(todoItems)
    // console.log(todoItems[0].date)
    // res.render("index.ejs")
    idNum++
    res.redirect("/")
})

app.delete("/delete/:id", (req, res)=>{
    //added the parseInt function in order to parse the value of the hidden input field from a string to an int, did this cuz I decided 
    const id = parseInt(req.params.id)
    let indexOfItemToRemove = todoItems.findIndex(obj => obj.id === id)
    if(indexOfItemToRemove !== -1)
    {
        todoItems.splice(indexOfItemToRemove, 1)
    }
    console.log(todoItems)
    res.render("index.ejs", {items: todoItems})
    //for some reason, res.redirect("/") breaks the response; my theory is that since we're supposed to be on the /delete/:id route and since we use the redirect function to redirect us to the homepage(which is the "/" url), the response sends back a 404 error saying that the DELETE request couldnt be found
})

app.put("/modify/:id", (req, res)=>{
    // console.log(req.body)
    // console.log(req.params)
    const id = parseInt(req.params.id)
    let indexOfItemToUpdate = todoItems.findIndex(obj => obj.id === id)
    if(indexOfItemToUpdate !== -1)
    {
        //note that the value for the value attribute is req.body.item and not req.body.todoItem like it is in the "/" route becuase this req.body comes from the JS object that I sent over from the front end using axios and I'm thinking about using the attribute name "item" rather than "todoItem" to avoid redundancy when sending over the body from the front end using axios 
        todoItems[indexOfItemToUpdate] = {id: id, date: req.body.date, value: req.body.item}
    }
    console.log(todoItems)
    //Going to see if just sending the status code along with a message as a response is enough or if I need to use res.render to avoid having the page's loading circle load indefinitely
    //Thinking that I dont need to send the index.ejs file again, that way I can avoid having to render each individual todo item on the front end like how I'm planning
    res.status(200).send("Updated Successfully")
})

app.listen(port, (req, res)=> {
    console.log(`Listening on port ${port}`)
})
