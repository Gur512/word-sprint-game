'use strict';

function select(selector, scope = document) {
    return scope.querySelector(selector);
}

function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

function selectAll(selector, scope = document) {
    return scope.querySelectorAll(selector);
}

const timer = select('.timer span');
const hitScore = select('.hits span');
const inputValue = select('.input');
const sampleBtn = select('.sample-btn');
const randomNum = select('.number');
const start = select('.start-btn');
const endMessage = select('.message');

const bgMusic = new Audio("./assets/audio/party-begins.mp3");
bgMusic.type = 'audio/wav';

const hoverSound = new Audio("./assets/audio/preview.mp3");

const wordBank = [
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
    'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
    'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
    'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
    'philosophy', 'database', 'periodic', 'capitalism', 'abominable', 'phone',
    'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
    'velvet', 'potion', 'treasure', 'beacon', 'labyrinth', 'whisper', 'breeze',
    'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology',
    'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
    'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
    'butterfly', 'discovery', 'ambition', 'music', 'eagle', 'crown',
    'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'door', 'bird',
    'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework',
    'beach', 'economy', 'interview', 'awesome', 'challenge', 'science',
    'mystery', 'famous', 'league', 'memory', 'leather', 'planet', 'software',
    'update', 'yellow', 'keyboard', 'window', 'beans', 'truck', 'sheep',
    'blossom', 'secret', 'wonder', 'enchantment', 'destiny', 'quest', 'sanctuary',
    'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil',
    'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
    'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort',
    'mask', 'escape', 'promise', 'band', 'level', 'hope', 'moonlight', 'media',
    'orchestra', 'volcano', 'guitar', 'raindrop', 'inspiration', 'diamond',
    'illusion', 'firefly', 'ocean', 'cascade', 'journey', 'laughter', 'horizon',
    'exploration', 'serendipity', 'infinity', 'silhouette', 'wanderlust',
    'marvel', 'nostalgia', 'serenity', 'reflection', 'twilight', 'harmony',
    'symphony', 'solitude', 'essence', 'melancholy', 'melody', 'vision',
    'silence', 'whimsical', 'eternity', 'cathedral', 'embrace', 'poet', 'ricochet',
    'mountain', 'dance', 'sunrise', 'dragon', 'adventure', 'galaxy', 'echo',
    'fantasy', 'radiant', 'serene', 'legend', 'starlight', 'light', 'pressure',
    'bread', 'cake', 'caramel', 'juice', 'mouse', 'charger', 'pillow', 'candle',
    'film', 'jupiter'
];

let shuffledWords = [];
let timerInterval;
let timeLeft = 30;
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
    let newScore = new Score(new Date(), hits, percentage);
    scores.push(newScore);  
    
    let message = `Game Over! You scored ${hits} hits. Accuracy: ${percentage}%.`;
    if (shuffledWords.length === 0) message += " Congrats! You completed all words!";
    endMessage.innerText = message;
}

function resetGame() {
    shuffleWords();
    timeLeft = 30;
    hits = 0;
    timer.textContent = timeLeft;
    hitScore.textContent = hits;
    inputValue.value = '';
    endMessage.innerText = '';
    inputValue.placeholder = "Type here to start!!";
    sampleBtn.style.display = 'none';
    inputValue.classList.add('visible');
    inputValue.disabled = false;
    for (let i = 0; i < 10; i++) {
        wordBank.push(`word${Math.random().toString(36).substr(2, 5)}`);
    }
    displayNextWord();
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        clearInterval(timerInterval);
        bgMusic.pause();
        inputValue.disabled = true;
    }
});

start.addEventListener('mouseover', () => {
    hoverSound.play();
});


start.addEventListener('click', () => {
    if (start.textContent === 'Restart') {
        clearInterval(timerInterval);
        bgMusic.pause();

        start.textContent = 'Restarting...';
        start.disabled = true; 

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
        inputValue.focus();
        currentWord = displayNextWord();
        inputValue.classList.add('visible');
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
