'use strict';

import * as utils from "./utils.js";

const timer = utils.select('.timer span');
const hitScore = utils.select('.hits span');
const inputValue = utils.select('.input');
const sampleBtn = utils.select('.sample-btn');
const randomNum = utils.select('.number');
const start = utils.select('.start-btn');
const endMessage = utils.select('.message');

const bgMusic = new Audio("./assets/audio/party-begins.mp3");
bgMusic.type = 'audio/wav';

const hoverSound = new Audio("./assets/audio/preview.mp3");

import { wordBank } from "./word.js";

let shuffledWords = [];
let timerInterval;
let timeLeft = 10;
let hits = 0;
let currentWord = '';
let matchIndex = 0;
let scores = [];

class Score {
    #date;
    #hits;
    #percentage;

    constructor(date, hits, percentage) {
        this.#date = date;
        this.#hits = hits;
        this.#percentage = percentage;
    }

    get date() {
        return this.#date;
    }

    get hits() {
        return this.#hits;
    }

    get percentage() {
        return this.#percentage;
    }
}

window.onload = () => {
    start.classList.add('flash'); 
};

function shuffleWords() {
    shuffledWords = [...wordBank].sort(() => Math.random() - 0.5);
}

function displayNextWord() {
    currentWord = shuffledWords.pop();
    randomNum.textContent = currentWord; 
    matchedPart = ""; 
    return currentWord;
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            endGame();
        } else if (timeLeft <= 6) {
            timer.textContent = --timeLeft;
            timer.style.color = "#c00";
        } else {
            timer.textContent = --timeLeft;
        }
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    bgMusic.pause();
    bgMusic.currentTime = 0;
    inputValue.disabled = true;
    inputValue.value = '';
    randomNum.value = '';
    let percentage = ((hits / wordBank.length) * 100).toFixed(2);
    const date = new Date().toLocaleString();
    let newScore = new Score(date, hits, percentage);
    scores.push(newScore);  
    let message = `Game Over! You scored ${hits} hits. Accuracy: ${percentage}%.`;
    if (shuffledWords.length === 0) message += " Congrats! You completed all words!";
    endMessage.innerText = message;
}

function resetGame() {
    shuffleWords();
    timeLeft = 10;
    hits = 0;
    timer.textContent = timeLeft;
    timer.style.color = "#fff";
    hitScore.textContent = hits;
    inputValue.value = '';
    endMessage.innerText = '';
    sampleBtn.style.display = 'none';
    inputValue.classList.add('visible');
    inputValue.disabled = false;
    displayNextWord();
}

start.addEventListener('mouseover', () => {
    hoverSound.play();
});

start.addEventListener('click', () => {
    if (start.textContent === 'Restart') {
        clearInterval(timerInterval);
        bgMusic.pause();

        start.textContent = 'Restarting...';
        start.disabled = true;
        inputValue.focus(); 

        setTimeout(() => {
            start.textContent = 'Restart';
            start.disabled = false;
            bgMusic.play();
            bgMusic.loop = true;
            resetGame();
            startTimer();
            inputValue.disabled = false;
            inputValue.focus();
            currentWord = displayNextWord();
        }, 1000); 
    } else {
        bgMusic.play();
        bgMusic.loop = true;
        start.textContent = 'Restart';
        start.classList.remove('flash');
        resetGame();
        startTimer();
        inputValue.disabled = false;
        currentWord = displayNextWord();
        inputValue.classList.add('visible');
        setTimeout(() => {
            inputValue.focus();
        }, 0);
    }
});


let matchedPart = "";

inputValue.addEventListener('input', (event) => {
    const typedText = inputValue.value.trim().toLowerCase();

    if (currentWord.startsWith(typedText)) {
        matchedPart = typedText;

        if (typedText === currentWord) {
            hits++; 
            hitScore.textContent = hits; 
            inputValue.value = ''; 

            if (shuffledWords.length === 0) {
                endGame(); 
            } else {
                currentWord = displayNextWord(); 
            }
        } else {
            randomNum.textContent = currentWord.slice(matchedPart.length);
        }
    } else {
        inputValue.value = matchedPart;
    }
});
