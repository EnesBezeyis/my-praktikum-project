document.addEventListener('DOMContentLoaded', () => {
    const puzzlePiecesContainer = document.getElementById('puzzle-pieces-container');
    const puzzleTargetContainer = document.getElementById('puzzle-target-container');
    const puzzleMessage = document.getElementById('puzzle-message');

    // Beispiel-Puzzleteile. Normalerweise wären dies Bilder-URLs oder kurze Texte.
    // Die 'data-order' ist entscheidend für die Lösung.
    const puzzleData = [
        { id: 'piece1', content: 'Teil 1: Mein Code...', order: 1 },
        { id: 'piece2', content: '...für eine coole...', order: 2 },
        { id: 'piece3', content: '...Webseite!', order: 3 },
        // Füge hier mehr Teile hinzu, z.B. Bild-URLs: { id: 'pic1', content: '<img src="path/to/img_part1.png" alt="Part 1">', order: 1 }
    ];

    // Mische die Puzzleteile für den Start
    const shuffledPuzzleData = [...puzzleData].sort(() => Math.random() - 0.5);

    // Initialisiere Puzzle-Teile und Zielbereiche
    function initPuzzle() {
        puzzlePiecesContainer.innerHTML = '';
        puzzleTargetContainer.innerHTML = '';
        puzzleMessage.classList.remove('visible'); // Botschaft verstecken

        shuffledPuzzleData.forEach(data => {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.setAttribute('draggable', 'true');
            piece.setAttribute('id', data.id);
            piece.setAttribute('data-order', data.order);
            piece.innerHTML = data.content;
            puzzlePiecesContainer.appendChild(piece);
        });

        // Erstelle leere Zielbereiche basierend auf der Anzahl der Teile
        puzzleData.sort((a, b) => a.order - b.order).forEach(data => {
            const target = document.createElement('div');
            target.classList.add('puzzle-target');
            target.setAttribute('data-target-order', data.order);
            target.textContent = `Ziel ${data.order}`; // Optional: zeige die Reihenfolge im Ziel
            puzzleTargetContainer.appendChild(target);
        });

        addDragListeners();
        addDropListeners();
    }

    let draggedItem = null;

    function addDragListeners() {
        document.querySelectorAll('.puzzle-piece').forEach(piece => {
            piece.addEventListener('dragstart', (e) => {
                draggedItem = e.target;
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.id); // Wichtig für Firefox
            });

            piece.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
        });
    }

    function addDropListeners() {
        document.querySelectorAll('.puzzle-target').forEach(target => {
            target.addEventListener('dragover', (e) => {
                e.preventDefault(); // Ermöglicht das Ablegen
            });

            target.addEventListener('drop', (e) => {
                e.preventDefault();
                if (!draggedItem) return;

                const targetOrder = parseInt(e.target.getAttribute('data-target-order'));
                const draggedOrder = parseInt(draggedItem.getAttribute('data-order'));

                // Wenn der Zielbereich noch leer ist UND die Reihenfolge stimmt
                if (e.target.classList.contains('puzzle-target') && draggedOrder === targetOrder && e.target.childElementCount === 0) {
                    e.target.appendChild(draggedItem);
                    checkPuzzleCompletion();
                } else if (e.target.classList.contains('puzzle-piece')) {
                     // Logik, um Teile innerhalb der Zielzone zu vertauschen
                     // Für dieses einfache Beispiel lassen wir das weg.
                     // Für komplexere Spiele müsste hier eine Sortierlogik rein.
                }
            });
        });
    }

    function checkPuzzleCompletion() {
        const targetChildren = Array.from(puzzleTargetContainer.children);
        if (targetChildren.length === puzzleData.length) {
            // Überprüfe die Reihenfolge der abgelegten Teile
            const allCorrect = targetChildren.every((child, index) => {
                const expectedOrder = index + 1; // 1-basiert
                const actualOrder = parseInt(child.getAttribute('data-order'));
                return actualOrder === expectedOrder;
            });

            if (allCorrect) {
                puzzleMessage.textContent = "🥳 Genial! Du hast das Praktikums-Puzzle gelöst! 🥳";
                puzzleMessage.classList.add('visible');
            } else {
                puzzleMessage.textContent = "Nicht ganz! Versuche es noch einmal. 🤔";
                puzzleMessage.classList.add('visible');
                // Optional: Teile zurücksetzen oder Hinweise geben
            }
        }
    }

    initPuzzle();
});