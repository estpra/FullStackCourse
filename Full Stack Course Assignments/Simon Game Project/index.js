let flashing = true
const duration = 20000; // 20 seconds in milliseconds
const startTime = Date.now(); // Record the start time

//Note that this is a recursive function
//Might need a function that resets the start time and changes flashing variable back to true once user messes up
function flashingTitle() {
    // Your code to execute on each iteration
    console.log("Iteration at " + new Date());
    $("#level-title").animate({ fontSize: "2.5rem" }).animate({ fontSize: "3rem" })
    //Thinking I'm going to have to add like 100ms or so of setTimout time right before the sequence starts because the time it tales for the title to stop flashing is still like 1 second behind from when I click, will have to see how it looks once I get there
    setTimeout(() => {
        // Check the current time
        if (Date.now() < startTime + duration && flashing) {
            // Schedule the next iteration
            setTimeout(flashingTitle(), 100); // Execute every 100ms (adjust as needed)
        } else {
            console.log("Loop completed after 20 seconds.");
        }
    }, 790)
}

$(".btn").click((event) => {
    // console.log(event.target.classList.contains("green"))
    flashing = false
    //This logic will be useful for the highScore variable
    $("span").text("Like DJ Kahlid")
    console.log(Math.floor(Math.random() * 4))
})

//called flashingTitle() here to allow the event handlers to be appplied to the selected element(s)
flashingTitle()
