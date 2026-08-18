const buttonColours = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];
let started = false;
let level = 0;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const frequencies = { green: 329.6, red: 261.6, yellow: 293.7, blue: 392.0, wrong: 100 };

function playSound(name) {
  if(audioCtx.state === 'suspended') audioCtx.resume();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.type = name === 'wrong' ? 'sawtooth' : 'sine';
  oscillator.frequency.value = frequencies[name];
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
  oscillator.stop(audioCtx.currentTime + 0.5);
}

function animatePress(currentColor) {
  const btn = document.getElementById(currentColor);
  btn.classList.add("active");
  setTimeout(() => btn.classList.remove("active"), 150);
}

function startGame() {
  if (!started) {
    level = 0;
    gamePattern = [];
    started = true;
    document.querySelector(".start-btn").style.display = "none";
    nextSequence();
  }
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  document.getElementById("level-title").innerText = "Level " + level;
  
  const randomChosenColour = buttonColours[Math.floor(Math.random() * 4)];
  gamePattern.push(randomChosenColour);
  
  setTimeout(() => {
    animatePress(randomChosenColour);
    playSound(randomChosenColour);
  }, 500);
}

function handleInput(color) {
  if (!started) return;
  
  userClickedPattern.push(color);
  playSound(color);
  animatePress(color);
  checkAnswer(userClickedPattern.length - 1);
}

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(nextSequence, 1000);
    }
  } else {
    playSound("wrong");
    document.body.style.backgroundColor = "red";
    setTimeout(() => document.body.style.backgroundColor = "#222", 200);
    document.getElementById("level-title").innerText = "Game Over, Press Start to Restart";
    document.querySelector(".start-btn").style.display = "inline-block";
    document.querySelector(".start-btn").innerText = "Restart";
    started = false;
  }
}
