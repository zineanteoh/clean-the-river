
let score = 0;
let totalRubbish = 0;
let clearedRubbish = 0;
let rubbish = []; // keeps track of the rubbish that have been clicked
let numberCount = 0; // keeps track of how many 'numbers' are in rubbish[]
let symbolCount = 0; // keeps track of how many 'symbols' are in rubbish[]

const river = document.querySelector(".river");
const equation = document.querySelector(".equation");
document.querySelector("#score").textContent = score; 
document.querySelector("#rubbish-cleared").textContent = clearedRubbish;


// testing
for(let i = 0; i < 15; i++) {
  addRubbish();
}




// Code template taken from YouTube video "Animation Loops in JavaScript using requestAnimationFrame by KIPURA"
let requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;
function animationLoop() {
  // Animate rubbish
  rubbish.forEach(function(item) {
    item.style.transform = `translate(${position})`;
  });
  requestAnimationFrame(animationLoop);
}
animationLoop();





function addRubbish() {
  // Maintain a 2:1 ratio for number:symbol
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
  // Random position
  newRubbish.style.top = Math.floor(Math.random() * 85) + "%";
  newRubbish.style.left = Math.floor(Math.random() * 40) + "%";

  river.appendChild(newRubbish);
  totalRubbish++;
}

function getNewNumber() {
  let newNumber = document.createElement("p");
  newNumber.textContent = Math.floor(Math.random() * 100);
  newNumber.classList.add("rubbish");
  newNumber.classList.add("number");
  newNumber.addEventListener("click", function() {
    if (newNumber.style.opacity == "1" || newNumber.style.opacity == "") {
      if (equation.children[0].textContent == "") {
        equation.children[0].textContent = newNumber.textContent;
        newNumber.style.opacity = "0.5";
        rubbish.push(newNumber);
      } else if (equation.children[2].textContent == "") {
        equation.children[2].textContent = newNumber.textContent;
        newNumber.style.opacity = "0.5";
        rubbish.push(newNumber);
      } else {
        console.log("Equation already has 2 numbers!");
      }
    }
  });
  return newNumber;
}

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
    if (newSymbol.style.opacity == "1" || newSymbol.style.opacity == "") {
      if (equation.children[1].textContent == "") {
        equation.children[1].textContent = newSymbol.textContent;
        newSymbol.style.opacity = "0.5";
        rubbish.push(newSymbol);
      } else {
        console.log("Equation already has a mathematical symbol!");
      };
    }
  });
  return newSymbol;
}

// Checks user answer
equation.lastElementChild.addEventListener("keyup", function(event) {
  if(event.keyCode === 13) {
    if (rubbish.length == 3) {
      validateEquation();
    } else {
      console.log("This is not a valid expression!"); 
    }
  };
});

function validateEquation() {
  let eq = equation.children;
  let left = "";
  let right = equation.lastElementChild.value;
  for(let i = 0; i <= 2; i++) {
    left += eq[i].textContent;
  }
  if (eval(left.replace("x", "*")) == eval(right)) {
    score += Math.abs(eval(left));
    document.querySelector("#score").textContent = score;
    clearedRubbish += 3;
    document.querySelector("#rubbish-cleared").textContent = clearedRubbish;
    console.log("Correct! " + left + " = " + eval(right));
    cleanRubbish();
  } else {
    console.log("Oops Wrong Answer! " + left + " is not " + eval(right));
    clearEquation();
  }
}

function cleanRubbish() {
  rubbish.forEach(function (item) {
    item.remove();
  });
  clearEquation();
  equation.lastElementChild.value = "";
}

function clearEquation() {
  // Clears equation and resets opacity for all rubbish
  rubbish.forEach(function (item) {
    item.style.opacity = "1";
  }); 
  rubbish = [];
  for(let i = 0; i <= 2; i++) {
    equation.children[i].textContent = "";
  }
  equation.lastElementChild.value = "";
}

function calculateScore() {
  return clearedRubbish / totalRubbish;
}

