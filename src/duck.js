let duckImg = document.getElementById("duck-img");
let duck = document.querySelector(".duck");
let moveID;
let isPaused = false;
let isFacingRight = true;

const interval = 200; // 200 ms of interval for setInterval()
const steps = 1; // number of steps taken for each walk function called
duck.style.left = "18%"; // set duck's initial position

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

export default class Duck {
  speak(text) {
    document.querySelector("#speech-txt").textContent = text;
  }

  wander() {
    clearInterval(moveID);
    moveID = setInterval(() => {
      if (!isPaused) {
        // Rolls dice
        let diceRoll = Math.floor(Math.random() * 6);
        // 50% chance of moving (if even)
        if (diceRoll % 2 == 0) {
          // for now, move left
          if (isFacingRight) {
            this.walkLeft();
          } else {
            this.walkRight();
          }
        }
      }
    }, interval * 10);
  }

  walkLeft() {
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

  walkRight() {
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

  fallsDown() {
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
}

export function getRandomDuckPhrase() {
  return duckPhrases[Math.floor(Math.random() * duckPhrases.length)];
}

export function getRandomPositivePhrase() {
  return positivePhrases[Math.floor(Math.random() * positivePhrases.length)];
}

export function getRandomEncouragement() {
  return encouragement[Math.floor(Math.random() * encouragement.length)];
}
