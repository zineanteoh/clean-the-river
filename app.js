
let selectedRubbish = []; // keeps track of the selected rubbish that are in equation
let numberCount = 0; // keeps track of how many 'numbers' are in river
let symbolCount = 0; // keeps track of how many 'symbols' are in river

const river = document.querySelector(".river");
const equation = document.querySelector(".equation");
let lives = 0;
let clearedRubbish = 0; 
const hudItem = document.querySelectorAll(".hud-item");

// Start the game based on the selected gamemode
let lapse; // time lapse between every new rubbish, in ms
let rubbishLimit; // limit of rubbish in a river
let rubbishFlowRate = 4; // rubbish flow rate. 4 is ideal
let interval; // adds rubbish at the rate of rubbishInflow per second using setInterval()

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
      document.querySelector("#title").remove();
      createEquationLog();
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

// Adds event listener to equation slots, which allows user to de-select rubbish 
const equationSlots = document.querySelectorAll(".equation-slot");
for(let i = 0; i < equationSlots.length; i++) {
  equationSlots[i].addEventListener("click", function() {
    if (equationSlots[i].textContent != "") {
      for(let j = 0; j < selectedRubbish.length; j++) {
        if (selectedRubbish[j].textContent == equationSlots[i].textContent) {
          // set greyed-out opacity back to 1
          selectedRubbish[j].style.opacity = "1";
          // remove the clicked rubbish from rubbishInEquation
          selectedRubbish.splice(j, 1);
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
    if (selectedRubbish.length == 3) {
      validateEquation();
    } else {
      console.log("This is not a valid expression!"); 
    }
  };
});

function startGame(symbolList, difficulty, health) {
  console.log(symbolList, difficulty, health);

  switch(difficulty) {
    case 'easy':
      lapse = 5000;
      rubbishLimit = 18;
      break;
    case 'normal':
      lapse = 3000;
      rubbishLimit = 24;
      break;
    case 'hard':
      lapse = 2000;
      rubbishLimit = 30;
      break;
    case 'insane':
      lapse = 1000; 
      rubbishLimit = 54;
      break;
  }

  if(health != "inf") {
    lives = parseFloat(health); 
    document.querySelector("#lives").textContent = parseFloat(health); 
  } else {
    lives = "∞";
    document.querySelector("#lives").textContent = "∞";
  }

  document.querySelector("#rubbish-cleared").textContent = clearedRubbish;

  // add rubbish
  let i = 0;
  let initiateRubbish = setInterval(function() {
    addRubbish(symbolList);
    i++;
    if (i >= rubbishLimit) {
      clearInterval(initiateRubbish);
      interval = setInterval(function() {
        if (numberCount + symbolCount <= rubbishLimit) {
          addRubbish(symbolList);
        }
      }, lapse);
    }
  }, 1000);
}

// Animate rubbish
// ...code template taken from the-art-of-web.com/javascript/animate-curved-path/
let requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame; 
let start = null; 
function step(timestamp) {
  // Animate rubbish
  let children = river.children;
  for(let i = 0; i < children.length; i++) {
    let progress, x, y;
    if (start === null) start = timestamp;
    
    progress = (timestamp - start) * rubbishFlowRate / 1000; // percent
    
    let child = children[i]; 
    child.style.left = limitMax(parseFloat(child.style.left) + (1 * rubbishFlowRate / 100), 0, 100) + "%";
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

// Create and add a new div element to represent the equation log 
function createEquationLog() {
  let eqLog = document.createElement("div");
  eqLog.classList.add("equationLog");
  document.querySelector(".header-content").appendChild(eqLog);
}

// Create and insert user-entered equation to the equation log
function addEquationLog(text, isCorrect) {
  let eqLog = document.querySelector(".equationLog");
  let newEq = document.createElement("p");
  newEq.classList.add("logText");
  if (isCorrect) {
    newEq.classList.add("correct");
  } else {
    newEq.classList.add("wrong");
  }
  newEq.innerHTML = text;
  eqLog.appendChild(newEq);

  // auto scrolls to bottom every time new text is added
  eqLog.scrollTop = eqLog.scrollHeight;
}

// Add rubbish (number or symbol) to river while maintaining a 2:1 ratio for number:symbol
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
  newRubbish.style.left = "0%"; 
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
        selectedRubbish.push(newNumber);
      } else if (equation.children[2].textContent == "") {
        equation.children[2].textContent = newNumber.textContent;
        newNumber.style.opacity = "0.5";
        selectedRubbish.push(newNumber);
      } else {
        console.log("Equation already has 2 numbers!");
      }
    } else {
      // Removes rubbish from the equation 
      newNumber.style.opacity = "1";
      for(let i = 0; i < equationSlots.length; i++) {
        if (equationSlots[i].textContent == newNumber.textContent) {
          for(let j = 0; j < selectedRubbish.length; j++) {
            if (selectedRubbish[j].textContent == equationSlots[i].textContent) {
              selectedRubbish[j].style.opacity = "1";
              selectedRubbish.splice(j, 1);
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
        selectedRubbish.push(newSymbol);
      } else {
        console.log("Equation already has a mathematical symbol!");
      };
    } else {
      // Removes rubbish from the equation
      newSymbol.style.opacity = "1";
      for(let i = 0; i < equationSlots.length; i++) {
        if (equationSlots[i].textContent == newSymbol.textContent) {
          for(let j = 0; j < selectedRubbish.length; j++) {
            if (selectedRubbish[j].textContent == equationSlots[i].textContent) {
              selectedRubbish[j].style.opacity = "1";
              selectedRubbish.splice(j, 1);
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
    left += eq[i].textContent + " ";
  }
  if (eval(left.replace("x", "*")) == eval(right)) {
    clearedRubbish += 3;
    symbolCount--;
    numberCount -= 2;
    // Update Lives & Rubbish Cleared 
    document.querySelector("#lives").textContent = lives;
    document.querySelector("#rubbish-cleared").textContent = clearedRubbish;
    console.log("Correct! " + left + " = " + eval(right));
    addEquationLog(left + "= " + eval(right), true);
    cleanRubbish();
  } else {
    console.log("Oops Wrong Answer! " + left + " is not " + eval(right));
    addEquationLog(left + "= " + "<span class='wrong-wavy'>" + eval(right) + "*</span>", false);
    clearEquation();
  }
}

// Removes rubbish from the river and calls clearEquation() 
function cleanRubbish() {
  selectedRubbish.forEach(function (item) {
    item.remove();
  });
  selectedRubbish = [];
  clearEquation();
  equation.lastElementChild.value = "";
}

// Clears equation by reseting the opacity for all rubbish and setting text to empty
function clearEquation() {
  selectedRubbish.forEach(function (item) {
    item.style.opacity = "1";
  }); 
  selectedRubbish = [];
  for(let i = 0; i <= 2; i++) {
    equation.children[i].textContent = "";
  }
  equation.lastElementChild.value = "";
}
