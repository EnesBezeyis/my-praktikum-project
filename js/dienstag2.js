// script.js

// Elemente vom DOM holen (bleiben gleich)
const startButton = document.getElementById('startButton');
const gameArea = document.getElementById('gameArea');
const clickTarget = document.getElementById('clickTarget'); // Brauchen wir immer noch für visuelles Feedback
const timerDisplay = document.getElementById('timer');
const clickCountDisplay = document.getElementById('clickCount');
const resultArea = document.getElementById('resultArea');
const finalClicksDisplay = document.getElementById('finalClicks');
const restartButton = document.getElementById('restartButton');

// Spielvariablen (bleiben gleich)
let clickCount = 0;
let timeLeft = 0;
const gameDuration = 10; // Spielzeit in Sekunden (z.B. 5 oder 10)
let timerInterval;
let gameStarted = false;
let spacebarPressed = false; // Flag, um wiederholte Klicks bei gedrückter Leertaste zu verhindern

// Funktion zum Initialisieren des Spiels (bleibt gleich)
function initializeGame() {
    clickCount = 0;
    timeLeft = gameDuration;
    clickCountDisplay.textContent = clickCount;
    timerDisplay.textContent = timeLeft;
    resultArea.classList.add('hidden');
    gameArea.classList.add('hidden');
    startButton.classList.remove('hidden');
    gameStarted = false;
    spacebarPressed = false; // Zurücksetzen
}

// Funktion zum Starten des Spiels
function startGame() {
    gameStarted = true;
    startButton.classList.add('hidden');
    gameArea.classList.remove('hidden');
    clickCount = 0;
    clickCountDisplay.textContent = clickCount;
    timeLeft = gameDuration;
    timerDisplay.textContent = timeLeft;

    // Timer starten (bleibt gleich)
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000); // Alle 1 Sekunde aktualisieren

    // *** WICHTIGE ÄNDERUNG HIER: Event Listener für Tastatureingaben ***
    document.addEventListener('keydown', handleSpacebarPress);
    document.addEventListener('keyup', handleSpacebarRelease); // Für das "spacebarPressed" Flag
    clickTarget.textContent = 'Drücke die Leertaste!'; // Angepasster Text
}

// *** NEUE FUNKTION: Behandelt das Drücken der Leertaste ***
function handleSpacebarPress(event) {
    if (gameStarted && event.code === 'Space' && !spacebarPressed) {
        // 'event.code' ist robuster als 'event.keyCode' oder 'event.which'
        // Das '!spacebarPressed' verhindert, dass der Zähler hochgezählt wird, solange die Taste gedrückt gehalten wird.
        clickCount++;
        clickCountDisplay.textContent = clickCount;
        spacebarPressed = true; // Flag setzen, um weitere Klicks zu verhindern

        // Optional: Visuelles Feedback auf dem clickTarget, wenn Leertaste gedrückt
        clickTarget.classList.add('active-space');
    }
}

// *** NEUE FUNKTION: Behandelt das Loslassen der Leertaste ***
function handleSpacebarRelease(event) {
    if (event.code === 'Space') {
        spacebarPressed = false; // Flag zurücksetzen, damit beim nächsten Drücken gezählt wird
        // Optional: Visuelles Feedback entfernen
        clickTarget.classList.remove('active-space');
    }
}


// Funktion zum Beenden des Spiels
function endGame() {
    gameStarted = false;
    clearInterval(timerInterval); // Timer stoppen

    // *** WICHTIGE ÄNDERUNG HIER: Event Listener entfernen ***
    document.removeEventListener('keydown', handleSpacebarPress);
    document.removeEventListener('keyup', handleSpacebarRelease);

    gameArea.classList.add('hidden');
    resultArea.classList.remove('hidden');
    finalClicksDisplay.textContent = clickCount;
}

// Event Listener für Buttons (bleiben gleich)
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', initializeGame);

// Spiel beim Laden der Seite initialisieren (bleibt gleich)
document.addEventListener('DOMContentLoaded', initializeGame);