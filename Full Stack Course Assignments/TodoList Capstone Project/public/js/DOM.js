// if(document.querySelector("html").getAttribute("data-bs-theme") === "dark")
// {
//     document.querySelector("footer").classList.toggle("drk-mode-waves")
//     // document.querySelector("footer").classList.remove("footer-look")
//     console.log(document.querySelector("footer").classList.value)
// }

document.querySelector("#drk-mode-btn").addEventListener("click", ()=>{
    // document.querySelector("html").toggleAttribute("data-bs-theme")
    if(document.querySelector("html").getAttribute("data-bs-theme") === "dark")
    {
        document.querySelector("html").removeAttribute("data-bs-theme")
        //Added this line of code to be able to remove the light grey background that is left over after changing the theme to dark; since we start with the dark theme(I made this default by starting with the data-bs-theme attribute added to the html element) we remove the class that adds the background color that matched the dark mode background
        document.querySelector("#reminder").classList.remove("todo-item")
    }
    else{
        //if you get here, the theme is light, not dark, so add the dark theme to the whole page
        document.querySelector("html").setAttribute("data-bs-theme", "dark")
        //this line adds the class that applies the dark background back to the todo items in order to match the dark theme
        document.querySelector("#reminder").classList.add("todo-item")
    }
    console.log(document.querySelector("html").getAttribute("data-bs-theme"))
})

// document.querySelector(".todo-item").addEventListener("keydown", ()=>{

// })