'use strict';

import * as utils from "./utils.js";
import { wordBank } from "./word.js";

const timer = utils.select('.timer span');
const hitScore = utils.select('.hits span');
const inputValue = utils.select('.input');
const sampleBtn = utils.select('.sample-btn');
const randomNum = utils.select('.number');
const start = utils.select('.start-btn');
const endMessage = utils.select('.message');
const scoreBoard = utils.select('.Scoreboard');
const scoreList = utils.select('.score-list');
const closeBtn = utils.select('.close');
const introContent = utils.select('.intro-content');
const introBtn = utils.select('.intro-btn');

const bgMusic = new Audio("./assets/audio/theme-track.mp3");
bgMusic.type = 'audio/wav';

const hoverSound = new Audio("./assets/audio/preview.mp3");
const endGameSound = new Audio("./assets/audio/six.mp3");

let shuffledWords = [];
let timerInterval;
let timeLeft = 20;
let hits = 0;
let currentWord = '';
let scores = [];
let matchedPart = "";

utils.listen ('mouseover', start, () => {
    hoverSound.play();
});

utils.listen('click', closeBtn, () => {
    introContent.style.display = 'none';
});

utils.listen('click', introBtn, () => {
    introContent.style.display = 'block';
});


utils.listen('click', start, () => {
    handleStart();
});

utils.listen('DOMContentLoaded', window, () => {
    loadScores();
    displayScoreboard(); 
    scoreBoard.style.display = 'none'; 
});


function loadScores() {
    const storedScores = localStorage.getItem('scores');
    if (storedScores) {
        scores = JSON.parse(storedScores);
    } else {
        scores = [];
    }
}

function saveScores() {
    scores.sort((a, b) => b.hits - a.hits);
    scores = scores.slice(0, 10);
    localStorage.setItem('scores', JSON.stringify(scores));
}

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
        } else {
            timer.textContent = --timeLeft;
        }
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    bgMusic.pause();
    endGameSound.play();
    bgMusic.currentTime = 0;
    inputValue.disabled = true;
    inputValue.value = '';
    randomNum.value = '';
    let percentage = ((hits / wordBank.length) * 100).toFixed(2);
    const date = new Date().toLocaleDateString();
    let newScore = {
        date: date,
        hits: hits,
        percentage: percentage
    };
    scores.push(newScore); 
    saveScores();
     
    setTimeout(() => {
        if (hits === 0) {
            endMessage.textContent = 'No hits recorded. Play again!';
            scoreBoard.style.display = 'none';  
        } else {
            displayScoreboard();  
            scoreBoard.style.display = 'flex';
            setTimeout(() => {
                scoreBoard.classList.add('show'); 
            }, 10); 
        }
    }, 1000);
}

function displayScoreboard() {
    scoreList.innerHTML = ''; 

    if (scores.length > 0) {
        scores.forEach((score, index) => {
            const li = document.createElement('li');
            li.classList.add('score-item'); 
            const formattedDate = new Date(score.date).toLocaleDateString('en-US', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
            });
            const formattedHits = score.hits.toString().padStart(2, '0');
            const formattedAccuracy = parseFloat(score.percentage).toFixed(1);
            li.innerHTML = `
                <span>#${index + 1}.</span> 
                <span>${formattedHits}hits</span>  
                <span>${formattedDate}</span> 
                <span>${formattedAccuracy}%</span>
            `; 

            scoreList.appendChild(li);
        });
    } else {
        const noScoresMessage = document.createElement('li');
        noScoresMessage.textContent = 'No scores available yet.';
        scoreList.appendChild(noScoresMessage);
    }
}

function resetGame() {
    shuffleWords();
    timeLeft = 20;
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
    scoreBoard.style.display = 'none';
    scoreBoard.classList.remove('show');
}

function handleStart() {
    if (start.textContent === 'Restart') {
        clearInterval(timerInterval);
        bgMusic.pause();

        start.textContent = 'Restarting...';
        start.disabled = true;
        scoreBoard.classList.remove('show');
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
        resetGame();
        startTimer();
        inputValue.disabled = false;
        currentWord = displayNextWord();
        inputValue.classList.add('visible');
        setTimeout(() => {
            inputValue.focus();
        }, 0);
    }
}

utils.listen('input', inputValue, (event) => {
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

})
