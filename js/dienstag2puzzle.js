// memory-script.js

// Elemente vom DOM holen - mit spezifischen IDs
const memoryBoard = document.getElementById('memory-board');
const movesDisplay = document.getElementById('memory-moves');
const timerDisplay = document.getElementById('memory-timer');
const startButton = document.getElementById('memory-start-button');
const statusMessage = document.getElementById('memory-status-message');

// Spielkonfiguration
const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']; // Beispielwerte für Karten
// Für Bilder könntest du hier URLs verwenden:
// const cardImages = ['img/cat.png', 'img/dog.png', ...];

let cards = []; // Array der Kartenobjekte
let flippedCards = []; // Speichert die gerade aufgedeckten Karten
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval;
let lockBoard = false; // Verhindert Klicks, während Karten verglichen werden

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

    // Erstelle doppelte Kartenwerte für Paare
    const gameCardValues = [...cardValues, ...cardValues];
    // Oder bei Bildern: const gameCardImages = [...cardImages, ...cardImages];

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
        cardBack.textContent = value; // Zeigt den Wert (oder ein img-Tag für Bilder)
        // Wenn du Bilder verwendest:
        // const img = document.createElement('img');
        // img.src = cardImages[cardValues.indexOf(value)]; // Annahme: cardValues und cardImages haben gleiche Reihenfolge
        // cardBack.appendChild(img);

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
    const clickedCard = event.currentTarget; // Das Element, an das der Event Listener gebunden ist

    // Klicks ignorieren, wenn:
    // - Das Board gesperrt ist (während Karten verglichen werden)
    // - Die Karte bereits aufgedeckt ist
    // - Die Karte bereits Teil eines gefundenen Paares ist
    if (lockBoard || clickedCard.classList.contains('flipped') || clickedCard.classList.contains('matched')) {
        return;
    }

    clickedCard.classList.add('flipped'); // Karte aufdecken
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = `Versuche: ${moves}`;
        lockBoard = true; // Board sperren, um weitere Klicks zu verhindern
        checkForMatch();
    }
}

// Funktion zum Überprüfen, ob die beiden aufgedeckten Karten übereinstimmen
function checkForMatch() {
    const [cardOne, cardTwo] = flippedCards;
    const isMatch = cardOne.dataset.value === cardTwo.dataset.value;

    if (isMatch) {
        // Paare gefunden
        cardOne.classList.add('matched');
        cardTwo.classList.add('matched');
        matchedPairs++;
        resetBoard(); // Board für nächste Runde entsperren und flippedCards leeren
        if (matchedPairs === cardValues.length) {
            endGame();
        }
    } else {
        // Keine Übereinstimmung, Karten nach kurzer Zeit wieder verdecken
        setTimeout(() => {
            cardOne.classList.remove('flipped');
            cardTwo.classList.remove('flipped');
            resetBoard();
        }, 1000); // 1 Sekunde warten, dann verdecken
    }
}

// Setzt den Zustand des Boards zurück für die nächste Runde
function resetBoard() {
    [flippedCards, lockBoard] = [[], false];
}

// Funktion zum Beenden des Spiels
function endGame() {
    clearInterval(timerInterval); // Timer stoppen
    statusMessage.textContent = `Spiel beendet! Du hast alle ${cardValues.length} Paare in ${moves} Versuchen und ${timer} Sekunden gefunden!`;
    startButton.textContent = 'Nochmal spielen'; // Text des Startbuttons ändern
}

// Event Listener für den Start-Button
startButton.addEventListener('click', initializeGame);

// Spiel beim Laden der Seite initialisieren
document.addEventListener('DOMContentLoaded', initializeGame);