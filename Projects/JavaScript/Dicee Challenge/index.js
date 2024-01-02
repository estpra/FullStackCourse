// function onMouseClick(){
//     dice1 = "./images/dice" + (Math.floor(Math.random()) * 6 + 1) + ".png"
//     dice2 = "./images/dice" + (Math.floor(Math.random()) * 6 + 1) + ".png"
//     document.querySelector(".img1").setAttribute("src", dice1)
//     document.querySelector(".img2").setAttribute("src", dice2)
// }


document.querySelector(".add-color").addEventListener("click", function(){
    var ranNum1 = Math.floor(Math.random() * 6) + 1
    var ranNum2 = Math.floor(Math.random() * 6) + 1
    var dice1 = "./images/dice" + ranNum1 + ".png"
    var dice2 = "./images/dice" + ranNum2 + ".png"
    if(ranNum1 > ranNum2)
    {
        document.querySelector("h1").innerHTML = "Player 1 Wins! 🚩"
    }
    else if(ranNum2 > ranNum1)
    {
        document.querySelector("h1").innerHTML = "Player 2 Wins! 🚩"
    }
    else{
        document.querySelector("h1").innerHTML = "Draw!"
    }
    document.querySelector(".img1").setAttribute("src", dice1)
    document.querySelector(".img2").setAttribute("src", dice2)
});