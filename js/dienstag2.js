document.addEventListener('DOMContentLoaded', () => {
    // Elemente vom DOM holen
    const startButton = document.getElementById('startButton');
    const gameArea = document.getElementById('gameArea');
    const clickTarget = document.getElementById('clickTarget'); // Brauchen wir immer noch für visuelles Feedback
    const timerDisplay = document.getElementById('timer');
    const clickCountDisplay = document.getElementById('clickCount');
    const resultArea = document.getElementById('resultArea');
    const finalClicksDisplay = document.getElementById('finalClicks');
    const restartButton = document.getElementById('restartButton');
    const clickFeedbackContainer = document.getElementById('clickFeedbackContainer'); // NEU: Für den Ripple-Effekt
    const clickHighscoreList = document.getElementById('clickHighscoreList'); // NEU: Für die Highscore-Liste

    // Spielvariablen
    let clickCount = 0;
    let timeLeft = 0;
    const gameDuration = 10; // Spielzeit in Sekunden (z.B. 5 oder 10)
    let timerInterval;
    let gameStarted = false;
    let spacebarPressed = false; // Flag, um wiederholte Klicks bei gedrückter Leertaste zu verhindern

    // Funktion zum Initialisieren des Spiels
    function initializeGame() {
        clickCount = 0;
        timeLeft = gameDuration;
        clickCountDisplay.textContent = clickCount;
        timerDisplay.textContent = timeLeft;
        finalClicksDisplay.textContent = 0; // Ergebnis-Anzeige zurücksetzen

        resultArea.classList.add('hidden');
        gameArea.classList.add('hidden');
        startButton.classList.remove('hidden'); // Start-Button anzeigen

        gameStarted = false;
        spacebarPressed = false; // Zurücksetzen

        clearInterval(timerInterval); // Sicherstellen, dass kein alter Timer läuft
        // Event Listener beim Initialisieren entfernen, falls sie noch aktiv sind
        document.removeEventListener('keydown', handleSpacebarPress);
        document.removeEventListener('keyup', handleSpacebarRelease);

        displayClickHighscores(); // Highscores immer laden
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

        // Timer starten
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000); // Alle 1 Sekunde aktualisieren

        // Event Listener für Tastatureingaben HIER HIN
        document.addEventListener('keydown', handleSpacebarPress);
        document.addEventListener('keyup', handleSpacebarRelease);
        clickTarget.textContent = 'Drücke die Leertaste!'; // Angepasster Text
    }

    // Behandelt das Drücken der Leertaste
    function handleSpacebarPress(event) {
        // Überprüfe, ob das Spiel läuft, die gedrückte Taste die Leertaste ist und ob sie nicht bereits gedrückt gehalten wird
        if (gameStarted && event.code === 'Space' && !spacebarPressed) {
            clickCount++;
            clickCountDisplay.textContent = clickCount;
            spacebarPressed = true; // Flag setzen, um weitere Klicks zu verhindern

            // Visuelles Feedback auf dem clickTarget, wenn Leertaste gedrückt
            clickTarget.classList.add('active-space');
            
            // Klick-Effekt auslösen (simuliert Klick in der Mitte des Buttons)
            const eventMock = {
                clientX: clickTarget.getBoundingClientRect().left + clickTarget.offsetWidth / 2,
                clientY: clickTarget.getBoundingClientRect().top + clickTarget.offsetHeight / 2,
            };
            createClickRipple(eventMock);
        }
    }

    // Behandelt das Loslassen der Leertaste
    function handleSpacebarRelease(event) {
        if (event.code === 'Space') {
            spacebarPressed = false; // Flag zurücksetzen, damit beim nächsten Drücken gezählt wird
            // Visuelles Feedback entfernen
            clickTarget.classList.remove('active-space');
        }
    }

    // Funktion zum Beenden des Spiels
    function endGame() {
        gameStarted = false;
        clearInterval(timerInterval); // Timer stoppen

        // Event Listener entfernen
        document.removeEventListener('keydown', handleSpacebarPress);
        document.removeEventListener('keyup', handleSpacebarRelease);

        gameArea.classList.add('hidden');
        resultArea.classList.remove('hidden');
        finalClicksDisplay.textContent = clickCount;

        saveClickHighscore(clickCount); // Highscore speichern
    }

    // NEU: Funktion für den Klick-Ripple-Effekt (angelehnt an das Mouse-Click-Beispiel)
    function createClickRipple(event) {
        const ripple = document.createElement('span');
        ripple.classList.add('click-ripple');

        // Position des Ripples relativ zum clickTarget
        const targetRect = clickTarget.getBoundingClientRect();
        const x = event.clientX - targetRect.left;
        const y = event.clientY - targetRect.top;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        clickFeedbackContainer.appendChild(ripple);

        // Entferne den Ripple nach der Animation
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }

    // NEU: Highscore-Management
    function saveClickHighscore(score) {
        let highscores = JSON.parse(localStorage.getItem('clickHighscores')) || [];
        highscores.push({ score: score, date: new Date().toLocaleString() });
        highscores.sort((a, b) => b.score - a.score); // Absteigend sortieren
        highscores = highscores.slice(0, 5); // Top 5 behalten
        localStorage.setItem('clickHighscores', JSON.stringify(highscores));
        displayClickHighscores();
    }

    // NEU: Highscore-Anzeige
    function displayClickHighscores() {
        const highscores = JSON.parse(localStorage.getItem('clickHighscores')) || [];
        clickHighscoreList.innerHTML = ''; // Liste leeren
        if (highscores.length === 0) {
            clickHighscoreList.innerHTML = '<li>Noch keine Highscores vorhanden.</li>';
            return;
        }
        highscores.forEach((entry, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${index + 1}. ${entry.score} Klicks <span>(${entry.date})</span>`;
            clickHighscoreList.appendChild(li);
        });
    }

    // Event Listener für Buttons
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', initializeGame);

    // Spiel beim Laden der Seite initialisieren
    document.addEventListener('DOMContentLoaded', initializeGame);
});