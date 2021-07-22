
let rubbishInEquation = []; // keeps track of the greyed out rubbish that are in equation
let numberCount = 0; // keeps track of how many 'numbers' are in river
let symbolCount = 0; // keeps track of how many 'symbols' are in river

const river = document.querySelector(".river");
const equation = document.querySelector(".equation");
let lives = 0;
let clearedRubbish = 0; 
const hudItem = document.querySelectorAll(".hud-item");
document.querySelector("#rubbish-cleared").textContent = clearedRubbish;


prepareGame();
function prepareGame() {
  // Add event listeners to symbols
  const symbols = document.querySelectorAll(".select-symbol");
  for(let i = 0; i < symbols.length; i++) {
    symbols[i].addEventListener("click", function() {
      symbols[i].classList.toggle("unselected");
    });
  }

  // Add event listeners to start game
  const startGameButton = document.querySelector(".start-game");
  startGameButton.addEventListener("click", function() {
    let plus = symbols[0].classList.contains("unselected") ? "" : "+";
    let minus = symbols[1].classList.contains("unselected") ? "" : "-";
    let multiply = symbols[2].classList.contains("unselected") ? "" : "x";
    let symbolList = plus + minus + multiply;
    let difficulty = document.getElementById("difficulty").value;
    let health = document.getElementById("health").value;
    if(symbolList != "") {
      document.querySelector(".menu").classList.add("hidden");
      document.querySelector(".gameplay").classList.remove("hidden");
      for(let i = 0; i < hudItem.length; i++) {
        hudItem[i].classList.remove("hidden");
      }
      // Start Game
      startGame(symbolList, difficulty, health);
    } else {
      console.log("You have to select at least ONE symbol!");
    }

  });
}

// Animate Objects on screen
// ...code template taken from the-art-of-web.com/javascript/animate-curved-path/
let requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame; 
// Variables for animating rubbish 
let start = null; 
let duration = 2; // longer duration = slower rubbish flow
function step(timestamp) {
  // Animate rubbish
  let children = river.children;
  for(let i = 0; i < children.length; i++) {
    let progress, x, y;
    if (start === null) start = timestamp;
    
    progress = (timestamp - start) / duration / 1000; // percent
    
    let child = children[i];
    child.style.left = limitMax(parseFloat(child.style.left) + (1 / duration / 10), 0, 100) + "%";
    child.style.top = parseFloat(child.style.top) + 0.1 * Math.sin(parseFloat(child.style.left)) + "%";
    
    if (progress >= 1) start = null;
  }
  requestAnimationFrame(step);

  // Sets a value to min once it exceeds max
  function limitMax(val, min, max) {
    return val > max ? min : val; 
  }
}
requestAnimationFrame(step);

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

// Start the game based on the selected gamemode
let startRubbish; // number of rubbish start of game
function startGame(symbolList, difficulty, health) {
  console.log(symbolList, difficulty, health);

  switch(difficulty) {
    case 'easy':
      startRubbish = 15;
      break;
    case 'normal':
      startRubbish = 24;
      break;
    case 'hard':
      startRubbish = 30;
      break;
    case 'insane':
      startRubbish = 45;
      break;
  }

  if(health != "inf") {
    lives = parseFloat(health); 
    document.querySelector("#lives").textContent = parseFloat(health); 
  } else {
    lives = "∞";
    document.querySelector("#lives").textContent = "∞";
  }

  for(let i = 0; i < startRubbish; i++) {
    addRubbish(symbolList);
  }
}

// Add a random rubbish (number or symbol) to river while maintaining a 2:1 ratio for number:symbol
function addRubbish(symbolList) {
  let newRubbish;
  if (numberCount / 2 > symbolCount) {
    newRubbish = getNewSymbol(symbolList);
    symbolCount++;
  } else if (numberCount / 2 < symbolCount) {
    newRubbish = getNewNumber();
    numberCount++;
  } else {
    if (Math.floor(Math.random() * 2) == 0) {
      newRubbish = getNewSymbol(symbolList);
      symbolCount++;
    } else {
      newRubbish = getNewNumber();
      numberCount++;
    }
  }
  // Set rubbish to a random position
  newRubbish.style.top = Math.floor(Math.random() * 85) + "%"; 
  newRubbish.style.left = (10 - Math.floor(Math.random() * 100)) + "%"; 
  river.appendChild(newRubbish);
}

// Returns a HTML element with a random number 
function getNewNumber() {
  let newNumber = document.createElement("p");
  newNumber.textContent = Math.floor(Math.random() * 99) + 1; // Number Range
  newNumber.classList.add("rubbish");
  newNumber.classList.add("number");
  newNumber.addEventListener("click", function() {
    // Listens to click event. When clicked, add number to the equation if there is an empty slot 
    if (newNumber.style.opacity == "1" || newNumber.style.opacity == "") {
      // Finds if empty slot available in the equation, if so add rubbish 
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
    } else {
      // Removes rubbish from the equation 
      newNumber.style.opacity = "1";
      for(let i = 0; i < equationSlots.length; i++) {
        if (equationSlots[i].textContent == newNumber.textContent) {
          for(let j = 0; j < rubbishInEquation.length; j++) {
            if (rubbishInEquation[j].textContent == equationSlots[i].textContent) {
              rubbishInEquation[j].style.opacity = "1";
              rubbishInEquation.splice(j, 1);
            }
          }
          equationSlots[i].textContent = "";
        }
      }
    }
  });
  return newNumber;
}

// Returns a HTML element with a random symbol (+, -, x)
function getNewSymbol(symbolList) {
  let newSymbol = document.createElement("p");
  let n = Math.floor(Math.random() * symbolList.length);
  newSymbol.textContent = symbolList[n];
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
    } else {
      // Removes rubbish from the equation
      newSymbol.style.opacity = "1";
      for(let i = 0; i < equationSlots.length; i++) {
        if (equationSlots[i].textContent == newSymbol.textContent) {
          for(let j = 0; j < rubbishInEquation.length; j++) {
            if (rubbishInEquation[j].textContent == equationSlots[i].textContent) {
              rubbishInEquation[j].style.opacity = "1";
              rubbishInEquation.splice(j, 1);
            }
          }
          equationSlots[i].textContent = "";
        }
      }
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
    clearedRubbish += 3;
    symbolCount--;
    numberCount -= 2;
    document.querySelector("#lives").textContent = lives;
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
