
let rubbishInEquation = []; // keeps track of the greyed out rubbish that are in equation
let numberCount = 0; // keeps track of how many 'numbers' are in river
let symbolCount = 0; // keeps track of how many 'symbols' are in river
let pixelCounts = []; // animates the movement of rubbish

const startRubbish = 30; // number of rubbish start of game
const river = document.querySelector(".river");
const equation = document.querySelector(".equation");
let score = 0;
let clearedRubbish = 0; 
let time = 0;
document.querySelector("#score").textContent = score; 
document.querySelector("#rubbish-cleared").textContent = clearedRubbish;
document.querySelector("#time").textContent = time;

// Start the game by populating rubbish on screen 
initiateRubbish();

// Adds event listener to equation slots, which allows user to de-select rubbish 
const equationSlots = document.querySelectorAll(".equation-slot");
for(let i = 0; i < equationSlots.length; i++) {
  equationSlots[i].addEventListener("click", function() {
    if (equationSlots[i].textContent != "") {
      for(let j = 0; j < rubbishInEquation.length; j++) {
        if (rubbishInEquation[j].textContent == equationSlots[i].textContent) {
          // set greyed-out opacity back to 1
          rubbishInEquation[j].style.opacity = "1";
          // remove the clicked rubbish from rubbishInEquation
          rubbishInEquation.splice(j, 1);
          break;
        }
      }
      equationSlots[i].textContent = "";
    }
  });
}

// Checks user answer when user presses [Enter] key
equation.lastElementChild.addEventListener("keyup", function(event) {
  if(event.keyCode === 13) {
    if (rubbishInEquation.length == 3) {
      validateEquation();
    } else {
      console.log("This is not a valid expression!"); 
    }
  };
});

// Animate Objects on screen
// Code template taken from YouTube video "Animation Loops in JavaScript using requestAnimationFrame by KIPURA"
let requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;
let pixelCount = 0;
function animationLoop() {
  // Animate rubbish
  let children = river.children;
  for(let i = 0; i < children.length; i++) {
    // Get pixelCount
    let child = children[i];
    pixelCount += 0.01;
    let childLeft = parseFloat(child.style.left) / 100 * window.innerWidth; 
    if (childLeft + pixelCount > window.innerWidth) {

    }
    // child.style.transform = `translate(${pixelCount}px)`;
  }
  requestAnimationFrame(animationLoop);
}
requestAnimationFrame(animationLoop);


// Populates the river with rubbish the moment the game starts
function initiateRubbish() {
  for(let i = 0; i < startRubbish; i++) {
    addRubbish();
  }
}

// Add a random rubbish (number or symbol) to river while maintaining a 2:1 ratio for number:symbol
function addRubbish() {
  let newRubbish;
  if (numberCount / 2 > symbolCount) {
    newRubbish = getNewSymbol();
    symbolCount++;
  } else if (numberCount / 2 < symbolCount) {
    newRubbish = getNewNumber();
    numberCount++;
  } else {
    if (Math.floor(Math.random() * 2) == 0) {
      newRubbish = getNewSymbol();
      symbolCount++;
    } else {
      newRubbish = getNewNumber();
      numberCount++;
    }
  }
  // Set rubbish to a random position
  newRubbish.style.top = Math.floor(Math.random() * 85) + "%";
  newRubbish.style.left = Math.floor(Math.random() * 98) + "%";
  river.appendChild(newRubbish);
}

// Returns a HTML element with a random number 
function getNewNumber() {
  let newNumber = document.createElement("p");
  newNumber.textContent = Math.floor(Math.random() * 100); // Number goes from 0 to 99
  newNumber.classList.add("rubbish");
  newNumber.classList.add("number");
  newNumber.addEventListener("click", function() {
    // Listens to click event. When clicked, add number to the equation if there is an empty slot 
    if (newNumber.style.opacity == "1" || newNumber.style.opacity == "") {
      if (equation.children[0].textContent == "") {
        equation.children[0].textContent = newNumber.textContent;
        newNumber.style.opacity = "0.5";
        rubbishInEquation.push(newNumber);
      } else if (equation.children[2].textContent == "") {
        equation.children[2].textContent = newNumber.textContent;
        newNumber.style.opacity = "0.5";
        rubbishInEquation.push(newNumber);
      } else {
        console.log("Equation already has 2 numbers!");
      }
    }
  });
  return newNumber;
}

// Returns a HTML element with a random symbol (+, -, x)
function getNewSymbol() {
  let newSymbol = document.createElement("p");
  let n = Math.floor(Math.random() * 3);
  if (n == 0) {
    newSymbol.textContent = "+";  
  } else if (n == 1) {
    newSymbol.textContent = "-";
  } else {
    newSymbol.textContent = "x";
  }
  newSymbol.classList.add("rubbish");
  newSymbol.classList.add("symbol");
  newSymbol.addEventListener("click", function() {
    // Listens to click event. When clicked, add symbol to the equation if slot is empty
    if (newSymbol.style.opacity == "1" || newSymbol.style.opacity == "") {
      if (equation.children[1].textContent == "") {
        equation.children[1].textContent = newSymbol.textContent;
        newSymbol.style.opacity = "0.5";
        rubbishInEquation.push(newSymbol);
      } else {
        console.log("Equation already has a mathematical symbol!");
      };
    }
  });
  return newSymbol;
}

// Validates the equation and updates the HUD and other variables
function validateEquation() {
  let eq = equation.children;
  let left = "";
  let right = equation.lastElementChild.value;
  for(let i = 0; i <= 2; i++) {
    left += eq[i].textContent;
  }
  if (eval(left.replace("x", "*")) == eval(right)) {
    score += Math.abs(eval(left.replace("x", "*")));
    clearedRubbish += 3;
    symbolCount--;
    numberCount -= 2;
    document.querySelector("#score").textContent = score;
    document.querySelector("#rubbish-cleared").textContent = clearedRubbish;
    console.log("Correct! " + left + " = " + eval(right));
    cleanRubbish();
  } else {
    console.log("Oops Wrong Answer! " + left + " is not " + eval(right));
    clearEquation();
  }
}

// Removes rubbish from the river and calls clearEquation() 
function cleanRubbish() {
  rubbishInEquation.forEach(function (item) {
    item.remove();
  });
  rubbishInEquation = [];
  clearEquation();
  equation.lastElementChild.value = "";
}

// Clears equation by reseting the opacity for all rubbish and setting text to empty
function clearEquation() {
  rubbishInEquation.forEach(function (item) {
    item.style.opacity = "1";
  }); 
  rubbishInEquation = [];
  for(let i = 0; i <= 2; i++) {
    equation.children[i].textContent = "";
  }
  equation.lastElementChild.value = "";
}
