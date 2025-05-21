// memory-script.js

// Elemente vom DOM holen - mit spezifischen IDs
const memoryBoard = document.getElementById('memory-board');
const movesDisplay = document.getElementById('memory-moves');
const timerDisplay = document.getElementById('memory-timer');
const startButton = document.getElementById('memory-start-button');
const statusMessage = document.getElementById('memory-status-message');
const highscoreDisplay = document.getElementById('memory-highscore'); // Neues Element für den Highscore

// Spielkonfiguration
const cardValues = ['😀', '🤑', '😈', '😡', '🤡', '🤢', '🤓', '🤖']; // Beispielwerte für Karten

let cards = []; // Array der Kartenobjekte
let flippedCards = []; // Speichert die gerade aufgedeckten Karten
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval;
let lockBoard = false; // Verhindert Klicks, während Karten verglichen werden
let highscore = Infinity; // Initialisiere Highscore mit Unendlich, damit jeder erste Score besser ist

// Funktion zum Initialisieren des Spiels
function initializeGame() {
    memoryBoard.innerHTML = ''; // Vorherige Karten entfernen
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    timer = 0;
    movesDisplay.textContent = `Versuche: ${moves}`;
    timerDisplay.textContent = `Zeit: ${timer}s`;
    statusMessage.textContent = '';
    clearInterval(timerInterval);
    lockBoard = false;

    // Lade Highscore aus dem Local Storage
    loadHighscore();

    // Erstelle doppelte Kartenwerte für Paare
    const gameCardValues = [...cardValues, ...cardValues];

    // Mischen der Kartenwerte
    shuffleArray(gameCardValues);

    // Gittergröße anpassen (z.B. 4x4 für 8 Paare = 16 Karten)
    const boardSize = Math.sqrt(gameCardValues.length);
    memoryBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    memoryBoard.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;

    // Karten erstellen und dem DOM hinzufügen
    gameCardValues.forEach((value, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.value = value; // Speichert den Wert der Karte

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');
        cardFront.textContent = '?'; // Oder ein Icon für die verdeckte Seite

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');
        cardBack.textContent = value; // Zeigt den Wert

        cardElement.appendChild(cardFront);
        cardElement.appendChild(cardBack);

        cardElement.addEventListener('click', handleCardClick);
        memoryBoard.appendChild(cardElement);
        cards.push(cardElement); // Speichert die DOM-Elemente im Array
    });

    startTimer();
}

// Fisher-Yates Shuffle Funktion
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Timer starten
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = `Zeit: ${timer}s`;
    }, 1000);
}

// Funktion zum Behandeln von Klicks auf Karten
function handleCardClick(event) {
    const clickedCard = event.currentTarget;

    if (lockBoard || clickedCard.classList.contains('flipped') || clickedCard.classList.contains('matched')) {
        return;
    }

    clickedCard.classList.add('flipped');
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = `Versuche: ${moves}`;
        lockBoard = true;
        checkForMatch();
    }
}

// Funktion zum Überprüfen, ob die beiden aufgedeckten Karten übereinstimmen
function checkForMatch() {
    const [cardOne, cardTwo] = flippedCards;
    const isMatch = cardOne.dataset.value === cardTwo.dataset.value;

    if (isMatch) {
        cardOne.classList.add('matched');
        cardTwo.classList.add('matched');
        matchedPairs++;
        resetBoard();
        if (matchedPairs === cardValues.length) {
            endGame();
        }
    } else {
        setTimeout(() => {
            cardOne.classList.remove('flipped');
            cardTwo.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }
}

// Setzt den Zustand des Boards zurück für die nächste Runde
function resetBoard() {
    [flippedCards, lockBoard] = [[], false];
}

// Funktion zum Beenden des Spiels
function endGame() {
    clearInterval(timerInterval);
    statusMessage.textContent = `Spiel beendet! Du hast alle ${cardValues.length} Paare in ${moves} Versuchen und ${timer} Sekunden gefunden!`;
    startButton.textContent = 'Nochmal spielen';

    // Highscore überprüfen und speichern
    if (moves < highscore) {
        highscore = moves;
        saveHighscore(highscore);
        highscoreDisplay.textContent = `Highscore: ${highscore} Versuche (Neu!)`;
    }
}

// Highscore in Local Storage speichern
function saveHighscore(score) {
    localStorage.setItem('memoryHighscore', score);
}

// Highscore aus Local Storage laden
function loadHighscore() {
    const savedHighscore = localStorage.getItem('memoryHighscore');
    if (savedHighscore !== null) {
        highscore = parseInt(savedHighscore, 10);
        highscoreDisplay.textContent = `Highscore: ${highscore} Versuche`;
    } else {
        highscoreDisplay.textContent = `Highscore: N/A`;
    }
}

// Event Listener für den Start-Button
startButton.addEventListener('click', initializeGame);

// Spiel beim Laden der Seite initialisieren
document.addEventListener('DOMContentLoaded', initializeGame);