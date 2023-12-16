// if(document.querySelector("html").getAttribute("data-bs-theme") === "dark")
// {
//     document.querySelector("footer").classList.toggle("drk-mode-waves")
//     // document.querySelector("footer").classList.remove("footer-look")
//     console.log(document.querySelector("footer").classList.value)
// }

$("#drk-mode-btn").on("click", () => {
    // document.querySelector("html").toggleAttribute("data-bs-theme")
    if (document.querySelector("html").getAttribute("data-bs-theme") === "dark") {
        document.querySelector("html").removeAttribute("data-bs-theme")
        //Added this line of code to be able to remove the light grey background that is left over after changing the theme to dark; since we start with the dark theme(I made this default by starting with the data-bs-theme attribute added to the html element) we remove the class that adds the background color that matched the dark mode background
        $("textarea").removeClass("todo-item")
        $("small>input").removeClass("completion")
    }
    else {
        //if you get here, the theme is light, not dark, so add the dark theme to the whole page
        document.querySelector("html").setAttribute("data-bs-theme", "dark")
        //this line adds the class that applies the dark background back to the todo items in order to match the dark theme
        $("textarea").addClass("todo-item")
        $("small>input").addClass("completion")
    }
    console.log(document.querySelector("html").getAttribute("data-bs-theme"))
})

// document.querySelector(".todo-item").addEventListener("keydown", ()=>{

// })

//gave the todo item forms an id to identify them by their id name so I wouldnt have to create the axios code to handle the POST request, cuz if I target the form element, since it prevents its default request(which is post in this case), the form for the create a reminder would not create a post request like it should, instead it would go to the event applied to it which is the axios http requests and then I would have to handle the post reqeust there; so really, did this for convinience 
$("form[name=\"myForm\"]").on("submit", function (event) {
    //this line of code prevents the default behavior of a form which is to send a post request and allows the axios code to work properly; without this line, the console.logs on the browser dont pop up for some reason
    event.preventDefault()
    //REMEMEBR, in order to view these console.logs, you must go to the console on the browser since this js file is used to manipilate the DOM which is bound to the browser; its why we use node.js to be able to use js outside of the browser and for the backend; all these console.logs were crucial for me to debug the bugs I was running into
    // console.log("Event handler works")
    // console.log(event.originalEvent.submitter.name)
    // console.log("id: " + this.elements.id.value)
    console.log(event)
    if (event.originalEvent.submitter.name === "delete") {
        axios.delete(`/delete/${this.elements.id.value}`)
            .then((res) => {
                console.log(res)
                console.log("Deleted successfully")
            })
            .catch((err) => console.error(err))
    }
    else if (event.originalEvent.submitter.name === "modify") {
        console.log("date: " + this.elements.date.value)
        console.log("todoItem: " + this.elements.todoItem.value)
        let newData = {
            date: this.elements.date.value,
            item: this.elements.todoItem.value
        }
        axios.put(`/modify/${this.elements.id.value}`, newData)
            .then((res) => {
                console.log(res)
                console.log("Updated Successfully")
            })
            .catch((err) => console.error(err))
    }
})
