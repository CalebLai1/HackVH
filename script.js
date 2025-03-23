let confidence = 50;
let difficulty = 1.0;
let negativeModeUnlocked = false;

function updateDifficulty() {
  let computed = 1 + (confidence - 50) / 50;
  difficulty = Math.min(2.0, Math.max(0.5, computed));
}

function updateDisplays() {
  document.getElementById("confidenceDisplay").textContent = "Confidence: " + confidence + "%";
  document.getElementById("difficultyDisplay").textContent = "Difficulty: " + difficulty.toFixed(2);
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
      correctAnswer = - (a * b);
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
      let a = - (b * tempAns);
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
  }
  document.getElementById("problemText").textContent = currentProblem;
  document.getElementById("answerInput").value = "";
  document.getElementById("feedbackMessage").textContent = "";
}

function checkAnswer() {
  const userInput = document.getElementById("answerInput").value;
  let userAnswer = parseFloat(userInput);
  if (isNaN(userAnswer)) {
    document.getElementById("feedbackMessage").textContent = "Please enter a numeric value.";
    return;
  }
  if (currentProblem.includes('/')) {
    if (Math.abs(userAnswer - correctAnswer) < 1e-2) {
      handleCorrect();
    } else {
      handleIncorrect();
    }
  } else {
    if (userAnswer === correctAnswer) {
      handleCorrect();
    } else {
      handleIncorrect();
    }
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
