const texts = ["Le courage n'est pas l'absence de peur, mais la capacité de vaincre ce qui fait peur. Nelson Mandela"];

// variables
let timer = 30;
let points = 0;
let mistakes = 0;
let wpm = 0;
let input = "";
let currentTextIndex = 0;
let currentText = texts[currentTextIndex];
let isCompleted = false; 
let startTime = null;
let endTime = null;
let interval = null;


// éléments HTML
const textElement = document.getElementById('text-to-type'); 
const inputField = document.getElementById('input-field'); 
const timerDisplay = document.getElementById('timer'); 
const mistakesDisplay = document.getElementById('mistakes'); 
const pointsDisplay = document.getElementById('points'); 
const dashDisplay = document.getElementById('dash'); 

function pushText() {
    textElement.innerHTML = '';
    const textWords = currentText.split(/\s+/);

    textWords.forEach((word, wordIndex) => {
        for (let i = 0; i < word.length; i++) {
            const char = word[i]; 
            const span = document.createElement('span');
            span.textContent = char; 
            span.className = 'untypedChar'; 
            textElement.appendChild(span);
        }
        if (wordIndex < textWords.length - 1) {
            const spaceSpan = document.createElement('span');
            spaceSpan.textContent = ' ';
            spaceSpan.className = 'spaceChar';
            textElement.appendChild(spaceSpan); 
        }
    });
}
pushText();

function startGame() {
    inputField.focus(); 
    startTime = Date.now();

    interval = setInterval(() => {
        timer--;
        timerDisplay.textContent = timer;
        if (timer <= 0) {
            clearInterval(interval);
            endGame();
        }
    }, 1000);
}

function calculateWPM() {
    const elapsedTime = (endTime - startTime) / 1000 / 60;
    const wordsTyped = input.length / 5;
    wpm = Math.round(wordsTyped / elapsedTime);
    dashDisplay.textContent = wpm;
}


function handleInput(event) {
    if (!startTime) {
        startGame();
    }
    input = event.target.value;
    updateTextHighlight();
    
    if (input.length === currentText.length) {
        if (currentTextIndex < texts.length - 1) {
            currentTextIndex++;
            nextText();
        } else {
            endGame();
        }
    }
}

function updateTextHighlight() {
    const spans = textElement.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (index < input.length) {
            span.classList.remove('untypedChar');
            span.classList.add(input[index] === span.textContent ? 'correctChar' : 'incorrectChar');
        } else {
            span.classList.remove('correctChar', 'incorrectChar'); 
            span.classList.add('untypedChar');
        }
    });
}

function nextText() {
    currentText = texts[currentTextIndex];
    input = ""; 
    isCompleted = false; 
    pushText(); 
    inputField.value = ""; 
    inputField.disabled = false; 
    inputField.focus();
}

function endGame() {
    isCompleted = true;
    endTime = Date.now();
    clearInterval(interval);
    calculateMistakes();
    calculatePoints();
    calculateWPM();
    inputField.disabled = true; 

}


function calculateMistakes() {
    mistakes = 0;
    for (let i = 0; i < input.length; i++) {
        if (currentText[i] !== input[i]) {
            mistakes++;
        }
    }
    mistakesDisplay.textContent = mistakes;
}


function calculatePoints() {
    points = Math.max(0, (input.length - mistakes)) * 10; 
    pointsDisplay.textContent = points;
}

inputField.addEventListener('input', handleInput);
