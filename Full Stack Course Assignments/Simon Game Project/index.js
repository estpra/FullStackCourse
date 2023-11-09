//title will be flashing if true, if false, title will stop flashing
let flashing = true
const duration = 25000; // 25 seconds in milliseconds
const startTime = Date.now(); // Record the start time
let level = 1
let highScore = 0
let playerSelectedPattern = []
let generatedPattern = []
//this variable will be used to check whether or not a game has already started, just in case user accidentally presses a key again once they have already started a game.
let startGame = true

//Note that this is a recursive function
//Might need a function that resets the start time and changes flashing variable back to true once user messes up
function flashingTitle() {
    //code to execute on each iteration
    console.log("Iteration at " + new Date());
    $("#level-title").animate({ fontSize: "2.7rem" }).animate({ fontSize: "3rem" })
    setTimeout(() => {
        // Check the current time
        if (Date.now() < startTime + duration && flashing) {
            // Schedule the next iteration
            setTimeout(flashingTitle(), 100); // Execute every 100ms (adjust as needed)
        } else {
            console.log("Loop completed after 25 seconds.");
        }
    }, 790)
}

function patternsMatch(){
    if(generatedPattern[level - 1] === playerSelectedPattern[level - 1])
    {
        return true
    }
    else{
        return false
    }
}

function gameOver()
{
    let gameoverSound = new Audio("./sounds/wrong.mp3")
    gameoverSound.play()
    $("body").addClass("gameover")
    setTimeout(()=>{
        $("body").removeClass("gameover")
    }, 200)
    $("#level-title").text("Game Over, Press Any Key to Restart")
    flashing = true
    startGame = true
    generatedPattern = []
    playerSelectedPattern = []
}

function generateSequence(){
    let colors = ["green", "red", "yellow", "blue"]
    let randomNum = Math.floor(Math.random() * 4)
    let randomColor = colors[randomNum]
    generatedPattern.push(randomColor)
    let sound = new Audio("./sounds/" + randomColor + ".mp3")
    //adding this setTimeout to enclose the code that creates the animation to make up for the little bit of lag when the flashing title animation ends
    setTimeout(()=>{
        sound.play()
        $("#" + randomColor).addClass("pattern-animation")
        setTimeout(()=>{
            $("#" + randomColor).removeClass("pattern-animation")
        }, 200)
    }, 600)
}

function pressedAnimation(color)
{
    let colorSound = new Audio("./sounds/" + color + ".mp3")
    colorSound.play()
    $("#" + color).addClass("pressed")
    setTimeout(()=>{
        $("#" + color).removeClass("pressed")
    }, 200)
}

$(document).keydown(()=> {
    if(startGame)
    {
    flashing = false
    startGame = false
    $("#level-title").text("Level " + level)
    }
    generateSequence()
})

$(".btn").click((event) => {
    // pressedAnimation(event.target.id)
    playerSelectedPattern.push(event.target.id)
    //starting from this line(95) to line 111, that is all code that is going to go into the else statement that is commented out, was just testing it to enusre it worked like how I wanted it to
    if(patternsMatch)
    {
        level++
        gameOver()
        if(level > highScore)
        {
            highScore = level
            setTimeout(()=>{
                let recordHolder = prompt("New Record! Enter name:")
                $("#highscore").text("Highscore: " + highScore +" " + recordHolder)
                setTimeout(()=>{
                    flashingTitle()
                }, 500)
            }, 400)
        }
        level = 1
    }
    // else{ //Player messes up
    // gameOver()
    // if(level > highScore)
    // {
    //     highScore = level
    //     let recordHolder = prompt("New Record! Enter name:")
    //     $("#highscore").text("Highscore: " + highScore + recordHolder)
    // }
    // flashing()
    // }
})

//called flashingTitle() here to allow the event handlers to be appplied to the selected element(s)
flashingTitle()
