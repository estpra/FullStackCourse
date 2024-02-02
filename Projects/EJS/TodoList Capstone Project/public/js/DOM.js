// if(document.querySelector("html").getAttribute("data-bs-theme") === "dark")
// {
//     document.querySelector("footer").classList.toggle("drk-mode-waves")
//     // document.querySelector("footer").classList.remove("footer-look")
//     console.log(document.querySelector("footer").classList.value)
// }

$("#drk-mode-btn").on("click", () => {
    if (document.querySelector("html").getAttribute("data-bs-theme") === "dark") {
        //if you get here, the theme is currently dark, so remove the attributes that enable the dark theme to revert back to light theme
        document.querySelector("html").removeAttribute("data-bs-theme")
        //Added this line of code to be able to remove the light grey background that is left over after changing the theme to dark; since we start with the dark theme(I made this default by starting with the data-bs-theme attribute added to the html element) we remove the class that adds the background color that matched the dark mode background
        $("textarea").removeClass("todo-item")
        //removes the light grey background using css class
        $("small>input").removeClass("completion")
        $("#drk-mode-btn").attr("value", "Dark Mode")
    }
    else {
        //if you get here, the theme is light, not dark, so add the dark theme to the whole page
        document.querySelector("html").setAttribute("data-bs-theme", "dark")
        //this line adds the class that applies the dark background back to the todo items in order to match the dark theme
        $("textarea").addClass("todo-item")
        $("small>input").addClass("completion")
        $("#drk-mode-btn").attr("value", "Light Mode")
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
                //Using location.reload() is the lazy way to solve the issue where the UI wasnt refreshing when a reminder was deleted, and, this solutin is not efficient and not recommended, will try to implement the correct way to do this rn
                // location.reload()
                //this is the proper and effecient way to remove a deleted reminder from the UI without having to refresh the web page
                $(`form[id=${this.elements.id.value}]`).remove()
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

//Added this eventListener to automatically adjust the height of the text area as a user types so the user doenst have to manually adjust the height themselves
$('textarea').on('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

//Next thing I want to figure out is how to automatically adjust the height of the text area based on its text contnent, not as the user types; this is for when a new reminder is added to the list so if it takes more than 2 lines, it can still show its full content
//I think this is as good as its going to get when it comes to having the newly added reminder, whenever a user clicks on a textarea(reminder) it will resize the textarea to the size of the input
$('textarea').on('click', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});
   




