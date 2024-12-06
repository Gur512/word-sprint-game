'use strict';

import * as utils from "./utils.js";
// import { utils } from "./utils.js";

const timer = utils.select('.timer span');
const hitScore = utils.select('.hits span');
const inputValue = utils.select('.input');
const sampleBtn = utils.select('.sample-btn');
const randomNum = utils.select('.number');
const start = utils.select('.start-btn');
const endMessage = utils.select('.message');
const scoreBoard = utils.select('.Scoreboard');
const scoreList = utils.select('.score-list');
const closeBtn = utils.select(".close");

const bgMusic = new Audio("./assets/audio/theme-track.mp3");
bgMusic.type = 'audio/wav';

const hoverSound = new Audio("./assets/audio/preview.mp3");
const endGameSound = new Audio("./assets/audio/six.mp3");

import { wordBank } from "./word.js";

let shuffledWords = [];
let timerInterval;
let timeLeft = 20;
let hits = 0;
let currentWord = '';
let matchIndex = 0;
let scores = [];

// class Score {
//     #date;
//     #hits;
//     #percentage;

//     constructor(date, hits, percentage) {
//         this.#date = date;
//         this.#hits = hits;
//         this.#percentage = percentage;
//     }

//     get date() {
//         return this.#date;
//     }

//     get hits() {
//         return this.#hits;
//     }

//     get percentage() {
//         return this.#percentage;
//     }
// }

// window.onload = () => {
//     start.classList.add('flash'); 
// };

function loadScores() {
    const storedScores = localStorage.getItem('scores');
    if (storedScores) {
        scores = JSON.parse(storedScores);
    } else {
        scores = []; // Initialize an empty array if no scores are found
    }
}

// Save scores to localStorage
function saveScores() {
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
            // timer.style.color = "#c00";
            // timer.classList.add('.flash');
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
    scores.sort((a, b) => b.hits - a.hits);
    scores = scores.slice(0, 10); // Keep top 10 scores

    localStorage.setItem('scores', JSON.stringify(scores));
    saveScores();  // Save updated scores to localStorage
     
    // let message = `Game Over! You scored ${hits} hits. Accuracy: ${percentage}%.`;
    // let message = `Game Over! You scored ${hits} hits`;
    // if (shuffledWords.length === 0) message += " Congrats! You completed all words!";
    // endMessage.innerText = message;
    setTimeout(() => {
        if(scores.length > 0) {
            displayScoreboard();
            scoreBoard.style.display = 'block';
        } else {
            endMessage.textContent = 'No hits recorded. Play again!';
        }
    }, 1000);
}

function displayScoreboard() {
    const scoreList = document.querySelector('.score-list');
    scoreList.innerHTML = ''; // Clear any previous scores

    if (scores.length > 0) {
        // Sort scores by hits, descending order, and limit to the top 10 scores
        // const topScores = scores.sort((a, b) => b.hits - a.hits).slice(0, 10);

        // Loop through each score and display it in the score-list
        scores.forEach((score, index) => {
            const li = document.createElement('li'); // Create a new list item
            li.classList.add('score-item'); // Optionally add a class to style individual score items

            const formattedHits = score.hits.toString().padStart(2, '0');
            const formattedAccuracy = parseFloat(score.percentage).toFixed(1);
            li.innerHTML = `
                <span>#${index + 1}.</span> 
                <span>${formattedHits}hits</span>  
                <span>${score.date}</span> 
                <span>${formattedAccuracy}%</span>
            `; // You can customize this to display any score details

            scoreList.appendChild(li); // Append the list item to the score-list
        });
    } else {
        // If no scores exist, display a message
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
}


utils.listen ('mouseover', start, () => {
    hoverSound.play();
});

utils.listen('click', closeBtn, () => {
    scoreBoard.style.display = "none";
});


function handleStart() {
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
        // inputValue.focus();
        // start.classList.remove('flash');
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

utils.listen('click', start, () => {
    handleStart();
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

loadScores();