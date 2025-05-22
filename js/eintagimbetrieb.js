document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizMessage = document.getElementById('quiz-message');

    const quizQuestions = [
        {
            question: "Welches Dateiformat wird typischerweise für Webseiten-Styles verwendet?",
            answers: ["HTML", "JS", "CSS", "JPG"],
            correct: "CSS"
        },
        {
            question: "Welche Sprache macht Webseiten interaktiv und dynamisch?",
            answers: ["Python", "Java", "JavaScript", "C#"],
            correct: "JavaScript"
        },
        {
            question: "Wofür steht die Abkürzung 'HTTP' im Kontext von Webadressen?",
            answers: ["HyperText Transfer Protocol", "High-Tech Tooling Program", "Home Test Tag Page", "Human Text Transferring Process"],
            correct: "HyperText Transfer Protocol"
        },
        {
            question: "Was ist ein 'Browser' in der Webentwicklung?",
            answers: ["Ein Programm zum Schreiben von Code", "Ein Programm zum Anzeigen von Webseiten", "Ein Server für Webseiten", "Eine Datenbank für Webdaten"],
            correct: "Ein Programm zum Anzeigen von Webseiten"
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    // Event Listener für den Start des Quiz
    if (startQuizBtn) { // Sicherstellen, dass der Button existiert
        startQuizBtn.addEventListener('click', startQuiz);
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        if (quizMessage) {
            quizMessage.classList.add('hidden');
        }
        displayQuestion();
    }

    function displayQuestion() {
        if (currentQuestionIndex < quizQuestions.length) {
            const q = quizQuestions[currentQuestionIndex];
            quizContainer.innerHTML = `
                <div id="quiz-question">${q.question}</div>
                <div class="quiz-answers">
                    ${q.answers.map(answer => `<button data-answer="${answer}">${answer}</button>`).join('')}
                </div>
            `;
            document.querySelectorAll('.quiz-answers button').forEach(button => {
                button.addEventListener('click', handleAnswerClick);
            });
        } else {
            showResult();
        }
    }

    function handleAnswerClick(event) {
        const selectedAnswer = event.target.dataset.answer;
        const correctAnswer = quizQuestions[currentQuestionIndex].correct;
        const allButtons = document.querySelectorAll('.quiz-answers button');

        // Deaktiviere alle Buttons nach der Auswahl und zeige richtig/falsch an
        allButtons.forEach(button => {
            button.disabled = true; // Buttons deaktivieren
            if (button.dataset.answer === correctAnswer) {
                button.classList.add('correct');
            } else if (button.dataset.answer === selectedAnswer) {
                button.classList.add('incorrect');
            }
        });

        if (quizMessage) {
            if (selectedAnswer === correctAnswer) {
                quizMessage.textContent = "Richtig! ✅";
            } else {
                quizMessage.textContent = `Falsch! Die richtige Antwort war: "${correctAnswer}" ❌`;
            }
            quizMessage.classList.remove('hidden');
            quizMessage.classList.add('visible'); // Für die CSS-Animation
        }


        if (selectedAnswer === correctAnswer) {
            score++;
        }

        // Gehe zur nächsten Frage nach einer kurzen Verzögerung
        setTimeout(() => {
            currentQuestionIndex++;
            if (quizMessage) {
                quizMessage.classList.remove('visible'); // Blende Nachricht vor der nächsten Frage aus
            }
            displayQuestion();
        }, 1500); // 1.5 Sekunden Verzögerung
    }

    function showResult() {
        quizContainer.innerHTML = `
            <h2>Quiz beendet!</h2>
            <p>Du hast ${score} von ${quizQuestions.length} Fragen richtig beantwortet.</p>
            <button id="restart-quiz-btn">Nochmal spielen</button>
        `;
        if (quizMessage) {
            quizMessage.classList.add('hidden'); // Verstecke die letzte Richtig/Falsch-Meldung
        }
        document.getElementById('restart-quiz-btn').addEventListener('click', startQuiz);
    }

    // Zeige den Start-Button, wenn die Seite geladen ist
    if (startQuizBtn) {
        startQuizBtn.style.display = 'block';
    }
});