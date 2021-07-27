// Most commonly used variables
let selectedRubbish = []; // keeps track of the selected rubbish that are in equation
let numberCount = 0; // keeps track of how many 'numbers' are in river
let symbolCount = 0; // keeps track of how many 'symbols' are in river
let lives;
let clearedRubbish = 0;

// DOM Elements
const river = document.querySelector(".river");
const equation = document.querySelector(".equation");
const hudItem = document.querySelectorAll(".hud-item");

// Game Configurations
let lapse; // time lapse between every new rubbish, in ms
let rubbishLimit; // limit of rubbish in a river
let rubbishFlowRate = 4; // rubbish flow rate. 4 is ideal
let rubbishIntervalID; // calls setInterval() and adds rubbish at the rate of rubbishInflow per second

// Calls animateDuck so that its subfunctions can be called
animateDuck();

init();

// Initialize game
function init() {
  animateDuck.stayStill();
  // Add event listeners for user to select/deselect symbols
  const symbols = document.querySelectorAll(".select-symbol");
  for (let i = 0; i < symbols.length; i++) {
    symbols[i].addEventListener("click", function () {
      symbols[i].classList.toggle("unselected");
    });
  }

  // Add event listeners to start game
  const startGameButton = document.querySelector(".start-game");
  startGameButton.addEventListener("click", function () {
    let symbolList = getUserSelectedSymbols(symbols);
    let difficulty = document.getElementById("difficulty").value;
    lives = document.getElementById("health").value;
    if (symbolList != "") {
      // Replaces screen
      document.querySelector(".menu").classList.add("hidden");
      document.querySelector(".gameplay").classList.remove("hidden");
      document.querySelector(".main-title").classList.add("sub-title");
      document.querySelector(".main-title").classList.remove("main-title");
      createEquationLog();
      for (let i = 0; i < hudItem.length; i++) {
        hudItem[i].classList.remove("hidden");
      }
      // Start Game
      startGame(symbolList, difficulty, lives);
    } else {
      console.log("You have to select at least ONE symbol!");
    }
  });
}

function startGame(symbolList, difficulty, health) {
  prepareGame();
  console.log(symbolList, difficulty, health);

  // Configure game difficulty
  switch (difficulty) {
    case "easy":
      lapse = 5000;
      rubbishLimit = 18;
      break;
    case "normal":
      lapse = 3000;
      rubbishLimit = 24;
      break;
    case "hard":
      lapse = 2000;
      rubbishLimit = 30;
      break;
    case "insane":
      lapse = 1000;
      rubbishLimit = 54;
      break;
  }

  // Update HUD display
  updateHUD();

  // Add rubbish objects using DOM
  let i = 0;
  let initiateRubbish = setInterval(function () {
    addRubbish(symbolList);
    i++;
    if (i >= rubbishLimit) {
      clearInterval(initiateRubbish);
      rubbishIntervalID = setInterval(function () {
        if (numberCount + symbolCount <= rubbishLimit) {
          addRubbish(symbolList);
        }
      }, lapse);
    }
  }, 1000);

  // Animate the rubbish flow
  animateRiver();
}

// Prepares the game by adding event listeners
const equationSlots = document.querySelectorAll(".equation-slot");
function prepareGame() {
  // Adds event listener to equation slots, which allows user to de-select rubbish
  for (let i = 0; i < equationSlots.length; i++) {
    equationSlots[i].addEventListener("click", function () {
      if (equationSlots[i].textContent != "") {
        for (let j = 0; j < selectedRubbish.length; j++) {
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

  // Adds event listener to check user's answer when [Enter] key is pressed
  equation.lastElementChild.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      if (selectedRubbish.length == 3) {
        validateEquation();
      } else {
        console.log("This is not a valid expression!");
      }
    }
  });
}

// Updates HUD (lives and rubbishCleared) using DOM
function updateHUD() {
  if (lives != "inf") {
    lives = parseFloat(lives);
    document.querySelector("#lives").textContent = parseFloat(lives);
  } else {
    lives = "∞";
    document.querySelector("#lives").textContent = "∞";
  }
  document.querySelector("#rubbish-cleared").textContent = clearedRubbish;
}

// Animate river's rubbish
function animateRiver() {
  // ...code template taken from the-art-of-web.com/javascript/animate-curved-path/
  let requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  let start = null;
  function step(timestamp) {
    // Loop through and animate each rubbish
    let children = river.children;
    for (let i = 0; i < children.length; i++) {
      let progress, x, y;
      if (start === null) start = timestamp;

      progress = ((timestamp - start) * rubbishFlowRate) / 1000; // percent

      let child = children[i];
      child.style.left =
        limitMax(
          parseFloat(child.style.left) + (1 * rubbishFlowRate) / 100,
          0,
          100
        ) + "%";
      // Deduct health if rubbish reaches end of river
      if ((child.style.left == "0%") & (lives != "∞")) {
        lives--;
        document.querySelector("#lives").textContent = lives;
        console.log("Deduct one health!");
      }
      child.style.top =
        parseFloat(child.style.top) +
        0.1 * Math.sin(parseFloat(child.style.left)) +
        "%";

      if (progress >= 1) start = null;
    }
    requestAnimationFrame(step);

    // Sets a value to min once it exceeds max
    function limitMax(val, min, max) {
      return val > max ? min : val;
    }
  }

  requestAnimationFrame(step);
}

// Returns a string of user selected symbols
function getUserSelectedSymbols(symbols) {
  let plus = symbols[0].classList.contains("unselected") ? "" : "+";
  let minus = symbols[1].classList.contains("unselected") ? "" : "-";
  let multiply = symbols[2].classList.contains("unselected") ? "" : "x";
  return plus + minus + multiply;
}

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
  newNumber.addEventListener("click", function () {
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
      for (let i = 0; i < equationSlots.length; i++) {
        if (equationSlots[i].textContent == newNumber.textContent) {
          for (let j = 0; j < selectedRubbish.length; j++) {
            if (
              selectedRubbish[j].textContent == equationSlots[i].textContent
            ) {
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
  newSymbol.addEventListener("click", function () {
    // Listens to click event. When clicked, add symbol to the equation if slot is empty
    if (newSymbol.style.opacity == "1" || newSymbol.style.opacity == "") {
      if (equation.children[1].textContent == "") {
        equation.children[1].textContent = newSymbol.textContent;
        newSymbol.style.opacity = "0.5";
        selectedRubbish.push(newSymbol);
      } else {
        console.log("Equation already has a mathematical symbol!");
      }
    } else {
      // Removes rubbish from the equation
      newSymbol.style.opacity = "1";
      for (let i = 0; i < equationSlots.length; i++) {
        if (equationSlots[i].textContent == newSymbol.textContent) {
          for (let j = 0; j < selectedRubbish.length; j++) {
            if (
              selectedRubbish[j].textContent == equationSlots[i].textContent
            ) {
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
  for (let i = 0; i <= 2; i++) {
    left += eq[i].textContent + " ";
  }
  if (eval(left.replace("x", "*")) == eval(right)) {
    // Right answer!
    console.log("Correct! " + left + " = " + eval(right));
    clearedRubbish += 3;
    symbolCount--;
    numberCount -= 2;
    // Update Lives & Rubbish Cleared
    document.querySelector("#lives").textContent = lives;
    document.querySelector("#rubbish-cleared").textContent = clearedRubbish;
    addEquationLog(left + "= " + eval(right), true);
    cleanRubbish();
  } else {
    // Wrong answer!
    console.log("Oops Wrong Answer! " + left + " is not " + eval(right));
    addEquationLog(
      left + "= " + "<span class='wrong-wavy'>" + eval(right) + "*</span>",
      false
    );
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
  for (let i = 0; i <= 2; i++) {
    equation.children[i].textContent = "";
  }
  equation.lastElementChild.value = "";
}

// Animate Duck
function animateDuck() {
  let duckImg = document.getElementById("duck-img");
  let duck = document.querySelector(".duck");

  let moveID; // variable to clear setInterval()
  let position; // start position for image slider
  let isFacingRight = true; // keeps track of which direction duck is facing
  const interval = 200; // 200 ms of interval for setInterval()
  const walkingSpeed = 2;

  duck.style.left = "15%"; // set duck's initial position

  function wander() {
    clearInterval(moveID);
  }

  function walkLeft() {
    clearInterval(moveID);
    if (isFacingRight) {
      // Flip image horizontally
      duckImg.style.transform = "scale(7.0) scaleX(-1)";
    }
    moveID = setInterval(() => {
      duckImg.style.backgroundPosition = `-${position}px 0px`;
      if (position < 36) {
        position += 12;
      } else {
        position = 12;
      }
      duck.style.left = parseFloat(duck.style.left) - walkingSpeed + "%";
    }, interval);
    isFacingRight = false;
  }

  function walkRight() {
    position = 12;
    clearInterval(moveID);
    if (!isFacingRight) {
      // Flip image horizontally
      duckImg.style.transform = "scale(7.0) scaleX(1)";
    }
    moveID = setInterval(() => {
      duckImg.style.backgroundPosition = `-${position}px 0px`;
      if (position < 36) {
        position += 12;
      } else {
        position = 12;
      }
      duck.style.left = parseFloat(duck.style.left) + walkingSpeed + "%";
    }, interval);
    isFacingRight = true;
  }

  function beHappy() {
    clearInterval(moveID);
    console.log("happy");
  }

  function beSad() {
    position = 12;
    clearInterval(moveID);
    moveID = setInterval(() => {
      duckImg.style.backgroundPosition = `-${position}px -12px`;
      if (position < 24) {
        position += 12;
      } else {
        position = 0;
      }
    }, interval * 5);
  }

  function stayStill() {
    position = 0;
    clearInterval(moveID);
    moveID = setInterval(() => {
      duckImg.style.backgroundPosition = `-${position}px 0px`;
      if (position < 12) {
        position += 12;
      } else {
        position = 0;
      }
    }, interval * 5); // increase interval for stayStill()
  }

  // Allow subfunctions to be called from outside
  animateDuck.wander = wander;
  animateDuck.walkLeft = walkLeft;
  animateDuck.walkRight = walkRight;
  animateDuck.beHappy = beHappy;
  animateDuck.beSad = beSad;
  animateDuck.stayStill = stayStill;
}

// Animate rubbish monster
function animateRubbishMonster() {}
