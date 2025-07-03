import quizData from './quizData.js';

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;
let userAnswers = [];

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const submitBtn = document.getElementById("submit-btn");
const finalScoreBox = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");
const timerDisplay = document.getElementById("timer");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");

const fill = document.createElement("div");
fill.id = "progress-bar-fill";
progressBar.appendChild(fill);

function loadQuestion() {
  resetTimer();
  const current = quizData[currentQuestion];
  questionText.textContent = `Q${currentQuestion + 1}. ${current.question}`;
  optionsContainer.innerHTML = "";
  current.options.forEach(option => {
    const label = document.createElement("label");
    label.classList.add("option");
    label.innerHTML = `
      <input type="radio" name="option" value="${option}" />
      ${option}
    `;
    optionsContainer.appendChild(label);
  });
  updateProgress();
  startTimer();
}

function startTimer() {
  timeLeft = 15;
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoSubmit();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timerDisplay.textContent = `Time Left: 15s`;
}

function autoSubmit() {
  const selected = document.querySelector('input[name="option"]:checked');
  const answer = selected ? selected.value : "Not Answered";
  const correctAnswer = quizData[currentQuestion].answer;
  if (answer === correctAnswer) score++;
  userAnswers.push({
    question: quizData[currentQuestion].question,
    selected: answer,
    correct: correctAnswer
  });
  currentQuestion++;
  currentQuestion < quizData.length ? loadQuestion() : showFinalScore();
}

submitBtn.addEventListener("click", () => {
  clearInterval(timer);
  const selected = document.querySelector('input[name="option"]:checked');
  const answer = selected ? selected.value : "Not Answered";
  const correctAnswer = quizData[currentQuestion].answer;
  if (answer === correctAnswer) score++;
  userAnswers.push({
    question: quizData[currentQuestion].question,
    selected: answer,
    correct: correctAnswer
  });
  currentQuestion++;
  currentQuestion < quizData.length ? loadQuestion() : showFinalScore();
});

function updateProgress() {
  progressText.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
  const percent = (currentQuestion / quizData.length) * 100;
  fill.style.width = `${percent}%`;
}

function showFinalScore() {
  document.getElementById("question-box").style.display = "none";
  submitBtn.style.display = "none";
  timerDisplay.style.display = "none";
  progressText.style.display = "none";
  progressBar.style.display = "none";
  finalScoreBox.style.display = "block";
  restartBtn.style.display = "inline-block";
  finalScoreBox.innerHTML = `<h2>Your Score: ${score} / ${quizData.length}</h2><h3>Review:</h3>`;
  userAnswers.forEach((entry, index) => {
    const isCorrect = entry.selected === entry.correct;
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>Q${index + 1}: ${entry.question}</strong></p>
      <p>Your Answer: <span class="${isCorrect ? 'correct' : 'wrong'}">${entry.selected}</span></p>
      <p>Correct Answer: <span class="correct">${entry.correct}</span></p>
      <hr/>
    `;
    finalScoreBox.appendChild(div);
  });
}

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  quizData = quizData.sort(() => Math.random() - 0.5);
  document.getElementById("question-box").style.display = "block";
  submitBtn.style.display = "inline-block";
  timerDisplay.style.display = "block";
  progressText.style.display = "block";
  progressBar.style.display = "block";
  finalScoreBox.style.display = "none";
  restartBtn.style.display = "none";
  loadQuestion();
});

loadQuestion();