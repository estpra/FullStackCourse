function pressedAnimation(key)
{
    var htmlElement = document.querySelector("." + key)
    htmlElement.classList.add("pressed")
    //setTimeout funtion adds a ms delay to the funtion that is passed in to the first parameter, the 2nd parameter is the number of ms the funtion will be delayed
    setTimeout(()=>{
        htmlElement.classList.remove("pressed")
    }, 100)
}

for(var i = 0; i < document.querySelectorAll(".drum").length; i++)
{
document.querySelectorAll(".drum")[i].addEventListener("click", function(){
    switch(this.innerHTML)
    {
        case "w":
            var crash = new Audio("./sounds/crash.mp3")
            crash.play()
            break
        
        case "a":
            var kick = new Audio("./sounds/kick-bass.mp3")
            kick.play()
            break

        case "s":
            var snare = new Audio("./sounds/snare.mp3")
            snare.play()
            break
        
        case "d":
            var tom1 = new Audio("./sounds/tom-1.mp3")
            tom1.play()
            break

        case "j":
            var tom2 = new Audio("./sounds/tom-2.mp3")
            tom2.play()
            break

        case "k":
            var tom3 = new Audio("./sounds/tom-3.mp3")
            tom3.play()
            break
        
        case "l":
            var tom4 = new Audio("./sounds/tom-4.mp3")
            tom4.play()
            break
        
        default:
            console.log(this.innerHTML)

    }
    pressedAnimation(this.innerHTML)
})
}

document.addEventListener("keydown", (Event)=>{
    switch(Event.key)
{
        case "w":
            var crash = new Audio("./sounds/crash.mp3")
            crash.play()
            break
        
        case "a":
            var kick = new Audio("./sounds/kick-bass.mp3")
            kick.play()
            break

        case "s":
            var snare = new Audio("./sounds/snare.mp3")
            snare.play()
            break
        
        case "d":
            var tom1 = new Audio("./sounds/tom-1.mp3")
            tom1.play()
            break

        case "j":
            var tom2 = new Audio("./sounds/tom-2.mp3")
            tom2.play()
            break

        case "k":
            var tom3 = new Audio("./sounds/tom-3.mp3")
            tom3.play()
            break
        
        case "l":
            var tom4 = new Audio("./sounds/tom-4.mp3")
            tom4.play()
            break
        
        default:
            console.log(Event)

}
pressedAnimation(Event.key)
})