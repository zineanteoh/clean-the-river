// Most commonly used variables
let selectedRubbish = []; // keeps track of the selected rubbish that are in equation
let numberCount = 0; // keeps track of how many 'numbers' are in river
let symbolCount = 0; // keeps track of how many 'symbols' are in river
let lives; // number of lives user have
let score = 0; // number of equations correctly solved by user

// DOM Elements
const river = document.querySelector(".river");
const equationSlots = document.querySelectorAll(".equation-slot");
const equation = document.querySelector(".equation");

// Game Configurations
let lapse; // time lapse between every new rubbish, in ms
let rubbishLimit; // limit of rubbish in a river
let rubbishFlowRate = 4; // rubbish flow rate. 4 is ideal
let initiateRubbishID; // id to clear interval
let rubbishIntervalID; // id to clear interval
let isGameRunning = true;

// Random duck phrases
const duckPhrases = [
  "Can you help me clean the river?",
  "#savetheplanet",
  "it's weird that a duck can speak right?",
  "Back in the days, rivers used to be clean",
  "Keep working on improving yourself",
  "The rubbish never end!",
  "Can elon musk send ducks to space?",
  "How do you find meaning in life?",
  // "Why am I here?",
  "I am determined to clean the river!",
  "quack.",
  "if life gives you lemon, don't throw it into the river",
  "Be a good person",
];

const encouragement = [
  "It's okay, try again!",
  "You won't grow if you never fail!",
  "I believe in you. Try that again",
  "hey! it's good that you're making mistakes!",
  "keeeeep trying!!!",
  "you got this! give it your best!",
];

const positivePhrases = [
  "You're doing a great job",
  "Nice work!",
  "That's good! Keep going!",
  "Your brain is working like a machine!",
  "Are you, perhaps, Einstein?",
  "I'm just a duck, but I'm impressed!",
  "Keep up the good work, my friend",
  "i hope you are having fun",
];

animateDuck();
animateDuck.wander();
animationLoop();
addEventListeners();

// Initialize game (called only once)
function addEventListeners() {
  addUserEventListeners();
  // Add event listeners for user to select/deselect symbols
  const symbols = document.querySelectorAll(".select-symbol");
  for (let i = 0; i < symbols.length; i++) {
    symbols[i].addEventListener("click", function () {
      symbols[i].classList.toggle("unselected");
    });
  }

  // Add event listeners to start game
  document.querySelector(".start-game").addEventListener("click", function () {
    let symbolList = getUserSelectedSymbols(symbols);
    let difficulty = document.getElementById("difficulty").value;
    lives = document.getElementById("health").value;
    if (symbolList != "") {
      // Replaces screen
      document.querySelector(".menu").classList.add("hidden");
      document.querySelector(".gameplay").classList.remove("hidden");
      document.querySelector(".main-title").classList.add("hidden");
      document.querySelector(".hud").classList.remove("hidden");
      // Start Game
      startGame(symbolList, difficulty, lives);
      animateDuck.speak("Here comes the rubbish!!");
    } else {
      animateDuck.speak("Select at least ONE symbol!");
    }
  });

  // Add event listener to allow user to exit game
  document.querySelector(".return-home").addEventListener("click", function () {
    returnHome();
  });
}

function startGame(symbolList, difficulty, health) {
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
  initiateRubbishID = setInterval(function () {
    if (isGameRunning) {
      addRubbish(symbolList);
      i++;
      if (i >= rubbishLimit) {
        clearInterval(initiateRubbishID);
        rubbishIntervalID = setInterval(function () {
          if (isGameRunning) {
            if (numberCount + symbolCount <= rubbishLimit) {
              addRubbish(symbolList);
            }
          }
        }, lapse);
      }
    }
  }, 1000);

  // Animate the rubbish flow
  animationLoop.startAnimation();
}

// Returns to home screen
function returnHome() {
  clearInterval(initiateRubbishID);
  clearInterval(rubbishIntervalID);
  document.querySelector(".menu").classList.remove("hidden");
  document.querySelector(".gameplay").classList.add("hidden");
  document.querySelector(".main-title").classList.remove("hidden");
  document.querySelector(".hud").classList.add("hidden");
  animationLoop.stopAnimation();
  // Resets all variables
  selectedRubbish = [];
  numberCount = 0;
  symbolCount = 0;
  lives = undefined;
  score = 0;
  let allRubbish = document.querySelectorAll(".rubbish");
  for (let i = 0; i < allRubbish.length; i++) {
    allRubbish[i].remove();
  }
  let equationLog = document.querySelector(".equation-log");
  while (equationLog.firstChild) {
    equationLog.removeChild(equationLog.firstChild);
  }
  initiateRubbishID = undefined; // id to clear interval
  rubbishIntervalID = undefined; // id to clear interval
  animateDuck.speak(getRandomDuckPhrase());
}

// Adds event listeners to allow user to interact with objects
function addUserEventListeners() {
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
  document.querySelector("#rubbish-cleared").textContent = score;
}

// Animation loop to animate river's rubbish
function animationLoop() {
  // ...code template taken from the-art-of-web.com/javascript/animate-curved-path/
  let requestID;
  let requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  let cancelAnimationFrame =
    window.cancelAnimationFrame || window.mozCancelAnimationFrame;
  let start = null;
  function step(timestamp) {
    // Loop through and animate each rubbish
    let children = river.children;
    for (let i = 0; i < children.length; i++) {
      let progress, x, y;
      if (startAnimation === null) startAnimation = timestamp;

      progress = ((timestamp - startAnimation) * rubbishFlowRate) / 1000; // percent

      let child = children[i];
      child.style.left =
        limitMax(
          parseFloat(child.style.left) + (1 * rubbishFlowRate) / 100,
          0,
          100
        ) + "%";
      // Deduct health if rubbish reaches end of river
      if ((child.style.left == "0%") & (lives != "∞")) {
        if (lives == 0) {
          endGame();
          console.log("Game over...");
        } else {
          lives--;
          document.querySelector("#lives").textContent = lives;
          console.log("You lost a health!");
        }
      }
      child.style.top =
        parseFloat(child.style.top) +
        0.1 * Math.sin(parseFloat(child.style.left)) +
        "%";

      if (progress >= 1) startAnimation = null;
    }
    requestID = requestAnimationFrame(step);

    // Sets a value to min once it exceeds max
    function limitMax(val, min, max) {
      return val > max ? min : val;
    }
  }

  // Stops rubbish animation and pauses agme
  function stopAnimation() {
    cancelAnimationFrame(requestID);
    isGameRunning = false;
  }

  // Starts rubbish animation
  function startAnimation() {
    requestID = requestAnimationFrame(step);
    isGameRunning = true;
  }

  animationLoop.stopAnimation = stopAnimation;
  animationLoop.startAnimation = startAnimation;
}

// Returns a string of user selected symbols
function getUserSelectedSymbols(symbols) {
  let plus = symbols[0].classList.contains("unselected") ? "" : "+";
  let minus = symbols[1].classList.contains("unselected") ? "" : "-";
  let multiply = symbols[2].classList.contains("unselected") ? "" : "x";
  return plus + minus + multiply;
}

// Create and insert user-entered equation to the equation log
function addEquationLog(text, isCorrect) {
  let eqLog = document.querySelector(".equation-log");
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
    animateDuck.speak(getRandomPositivePhrase());
    console.log("Correct! " + left + " = " + eval(right));
    score++;
    symbolCount--;
    numberCount -= 2;
    // Update Lives & Rubbish Cleared
    document.querySelector("#lives").textContent = lives;
    document.querySelector("#rubbish-cleared").textContent = score;
    addEquationLog(left + "= " + eval(right), true);
    cleanRubbish();
  } else {
    // Wrong answer!
    animateDuck.fallsDown();
    animateDuck.speak(getRandomEncouragement());
    // console.log("Oops Wrong Answer! " + left + " is not " + eval(right));
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
  let isPaused = false;
  let isFacingRight = true; // keeps track of which direction duck is facing
  const interval = 200; // 200 ms of interval for setInterval()
  const steps = 1; // number of steps taken for each walk function called

  duck.style.left = "18%"; // set duck's initial position

  function speak(text) {
    document.querySelector("#speech-txt").textContent = text;
  }

  function wander() {
    clearInterval(moveID);
    moveID = setInterval(() => {
      if (!isPaused) {
        // Rolls dice
        let diceRoll = Math.floor(Math.random() * 6);
        // 50% chance of moving (if even)
        if (diceRoll % 2 == 0) {
          // for now, move left
          if (isFacingRight) {
            walkLeft();
          } else {
            walkRight();
          }
        }
      }
    }, interval * 10);
  }

  function walkLeft() {
    let count = 0;
    let pos = 12;
    if (isFacingRight) {
      // Flip image horizontally
      duckImg.style.transform = "scale(7.0) scaleX(-1)";
    }
    isFacingRight = false;
    let tempID = setInterval(() => {
      duckImg.style.backgroundPosition = `-${pos}px 0px`;
      if (pos < 36) {
        pos += 12;
      } else {
        pos = 12;
      }
      duck.style.left = parseFloat(duck.style.left) - steps + "%";
      count++;
      if (count > 5) {
        clearInterval(tempID);
        duckImg.style.backgroundPosition = `0px 0px`;
      }
    }, interval);
  }

  function walkRight() {
    let count = 0;
    let pos = 12;
    if (!isFacingRight) {
      // Flip image horizontally
      duckImg.style.transform = "scale(7.0) scaleX(1)";
    }
    isFacingRight = true;
    let tempID = setInterval(() => {
      duckImg.style.backgroundPosition = `-${pos}px 0px`;
      if (pos < 36) {
        pos += 12;
      } else {
        pos = 12;
      }
      duck.style.left = parseFloat(duck.style.left) + steps + "%";
      count++;
      if (count > 5) {
        clearInterval(tempID);
        duckImg.style.backgroundPosition = `0px 0px`;
      }
    }, interval);
  }

  function fallsDown() {
    isPaused = true;
    let count = 0;
    let pos = 12;
    let tempID = setInterval(() => {
      duckImg.style.backgroundPosition = `-${pos}px -12px`;
      if (pos < 24) {
        pos += 12;
      } else {
        pos = 0;
      }
      count++;
      if (count > 3) {
        isPaused = false;
        clearInterval(tempID);
        duckImg.style.backgroundPosition = `0px 0px`;
      }
    }, interval * 5);
  }

  // Allow subfunctions to be called from outside
  animateDuck.speak = speak;
  animateDuck.wander = wander;
  animateDuck.walkLeft = walkLeft;
  animateDuck.walkRight = walkRight;
  animateDuck.fallsDown = fallsDown;
}

function getRandomDuckPhrase() {
  return duckPhrases[Math.floor(Math.random() * duckPhrases.length)];
}

function getRandomPositivePhrase() {
  return positivePhrases[Math.floor(Math.random() * positivePhrases.length)];
}

function getRandomEncouragement() {
  return encouragement[Math.floor(Math.random() * encouragement.length)];
}
