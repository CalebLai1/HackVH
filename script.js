let confidence = 50;
let difficulty = 1.0;
let negativeModeUnlocked = false;

function updateDifficulty() {
  // Adjusting the formula to widen the difficulty range.
  let computed = 1 + (confidence - 50) / 30;
  difficulty = Math.min(3.0, Math.max(0.5, computed));
}

function updateDisplays() {
  document.getElementById("confidenceDisplay").textContent = confidence + "%";
  document.getElementById("difficultyDisplay").textContent = difficulty.toFixed(2);
  document.getElementById("confidenceBar").style.width = confidence + "%";
}

let currentProblem = "";
let correctAnswer = 0;

function generateProblem() {
  let maxVal = Math.floor(10 * difficulty);
  if (maxVal < 10) maxVal = 10;
  
  if (confidence < 60) {
    if (negativeModeUnlocked) {
      let a = Math.floor(Math.random() * maxVal) + 1;
      let b = Math.floor(Math.random() * maxVal) + 1;
      currentProblem = `- ${a} + - ${b}`;
      correctAnswer = -(a + b);
    } else {
      let a = Math.floor(Math.random() * maxVal) + 1;
      let b = Math.floor(Math.random() * maxVal) + 1;
      currentProblem = `${a} + ${b}`;
      correctAnswer = a + b;
    }
  } else if (confidence < 70) {
    if (negativeModeUnlocked) {
      let a = Math.floor(Math.random() * maxVal) + 1;
      let b = Math.floor(Math.random() * maxVal) + 1;
      if (a >= b) { [a, b] = [Math.min(a, b), Math.max(a, b)]; }
      currentProblem = `${a} - ${b}`;
      correctAnswer = a - b;
    } else {
      let a = Math.floor(Math.random() * maxVal) + 1;
      let b = Math.floor(Math.random() * maxVal) + 1;
      currentProblem = `${a} - ${b}`;
      correctAnswer = a - b;
    }
  } else if (confidence < 85) {
    if (negativeModeUnlocked) {
      let a = Math.floor(Math.random() * maxVal) + 1;
      let b = Math.floor(Math.random() * maxVal) + 1;
      currentProblem = `- ${a} * ${b}`;
      correctAnswer = -(a * b);
    } else {
      let a = Math.floor(Math.random() * maxVal) + 1;
      let b = Math.floor(Math.random() * maxVal) + 1;
      currentProblem = `${a} * ${b}`;
      correctAnswer = a * b;
    }
  } else if (confidence < 95) {
    if (negativeModeUnlocked) {
      let b = Math.floor(Math.random() * (maxVal - 1)) + 1;
      let tempAns = Math.floor(Math.random() * maxVal) + 1;
      let a = -(b * tempAns);
      currentProblem = `${a} / ${b}`;
      correctAnswer = -tempAns;
    } else {
      let b = Math.floor(Math.random() * (maxVal - 1)) + 1;
      let tempAns = Math.floor(Math.random() * maxVal) + 1;
      let a = b * tempAns;
      currentProblem = `${a} / ${b}`;
      correctAnswer = tempAns;
    }
  } else {
    let randomChoice = Math.random();
    if (randomChoice < 0.33) {
      let a = Math.floor(Math.random() * maxVal) + 1;
      let xSolution = Math.floor(Math.random() * (2 * maxVal + 1)) - maxVal;
      let b = Math.floor(Math.random() * (2 * maxVal + 1)) - maxVal;
      let c = a * xSolution + b;
      let equationStr = "";
      equationStr += (a === 1 ? "x" : a + "x");
      if (b < 0) {
        equationStr += " - " + Math.abs(b);
      } else {
        equationStr += " + " + b;
      }
      equationStr += " = " + c;
      currentProblem = "Solve for x: " + equationStr;
      correctAnswer = xSolution;
    } else if (randomChoice < 0.66) {
      let a1, b1, a2, b2;
      do {
         a1 = Math.floor(Math.random() * maxVal) + 1;
         b1 = Math.floor(Math.random() * maxVal) + 1;
         a2 = Math.floor(Math.random() * maxVal) + 1;
         b2 = Math.floor(Math.random() * maxVal) + 1;
      } while(a1 * b2 - a2 * b1 === 0);
      let solX = Math.floor(Math.random() * (2 * maxVal + 1)) - maxVal;
      let solY = Math.floor(Math.random() * (2 * maxVal + 1)) - maxVal;
      let c1 = a1 * solX + b1 * solY;
      let c2 = a2 * solX + b2 * solY;
      currentProblem = "Solve system: " + a1 + "x + " + b1 + "y = " + c1 + ", " + a2 + "x + " + b2 + "y = " + c2;
      correctAnswer = [solX, solY];
    } else {
      let a;
      do {
         a = Math.floor(Math.random() * maxVal) + 1;
      } while(a % 2 !== 0);
      let R = Math.floor(Math.random() * maxVal) + 1;
      let result = a * Math.pow(R, 2) / 2;
      currentProblem = "Evaluate the integral: ∫₀^" + R + " " + a + "x dx";
      correctAnswer = result;
    }
  }
  
  document.getElementById("problemText").textContent = currentProblem;
  document.getElementById("answerInput").value = "";
  document.getElementById("feedbackMessage").textContent = "";
}

function checkAnswer() {
  const userInput = document.getElementById("answerInput").value;
  if (currentProblem.includes("Solve system:")) {
    let parts = userInput.split(",");
    if (parts.length !== 2) {
      document.getElementById("feedbackMessage").textContent = "Please enter two numbers separated by a comma.";
      return;
    }
    let userX = parseFloat(parts[0]);
    let userY = parseFloat(parts[1]);
    if (isNaN(userX) || isNaN(userY)) {
      document.getElementById("feedbackMessage").textContent = "Please enter valid numbers.";
      return;
    }
    if (Math.abs(userX - correctAnswer[0]) < 1e-2 && Math.abs(userY - correctAnswer[1]) < 1e-2) {
      handleCorrect();
    } else {
      handleIncorrect();
    }
    return;
  }
  if (currentProblem.includes("∫")) {
    let userAnswer = parseFloat(userInput);
    if (isNaN(userAnswer)) {
      document.getElementById("feedbackMessage").textContent = "Please enter a numeric value.";
      return;
    }
    if (Math.abs(userAnswer - correctAnswer) < 1e-2) {
      handleCorrect();
    } else {
      handleIncorrect();
    }
    return;
  }
  if (currentProblem.includes('/')) {
    let userAnswer = parseFloat(userInput);
    if (isNaN(userAnswer)) {
      document.getElementById("feedbackMessage").textContent = "Please enter a numeric value.";
      return;
    }
    if (Math.abs(userAnswer - correctAnswer) < 1e-2) {
      handleCorrect();
    } else {
      handleIncorrect();
    }
    return;
  }
  let userAnswer = parseFloat(userInput);
  if (isNaN(userAnswer)) {
    document.getElementById("feedbackMessage").textContent = "Please enter a numeric value.";
    return;
  }
  if (userAnswer === correctAnswer) {
    handleCorrect();
  } else {
    handleIncorrect();
  }
}

function handleCorrect() {
  document.getElementById("feedbackMessage").textContent = "Correct!";
  confidence = Math.min(100, confidence + 10);
  if (!negativeModeUnlocked && confidence >= 85) {
    negativeModeUnlocked = true;
  }
  updateDifficulty();
  updateDisplays();
  setTimeout(generateProblem, 1000);
}

function handleIncorrect() {
  document.getElementById("feedbackMessage").textContent = "Wrong. The correct answer was " + correctAnswer + ".";
  confidence = Math.max(0, confidence - 15);
  updateDifficulty();
  updateDisplays();
  setTimeout(generateProblem, 1500);
}

document.getElementById("submitBtn").addEventListener("click", checkAnswer);
document.getElementById("answerInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") { checkAnswer(); }
});
document.getElementById("startBtn").addEventListener("click", function() {
  confidence = 50;
  negativeModeUnlocked = false;
  updateDifficulty();
  updateDisplays();
  generateProblem();
});
