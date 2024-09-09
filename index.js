const cells = document.querySelectorAll('[data-cell]');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
let currentPlayer = 'X'; // Player starts first
let gameActive = true;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function handleClick(event) {
    const cell = event.target;
    if (cell.textContent || !gameActive || currentPlayer === 'O') return; // Prevent clicking when it's computer's turn
    cell.textContent = currentPlayer;
    if (checkWin()) {
        statusElement.textContent = `${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }
    if ([...cells].every(cell => cell.textContent)) {
        statusElement.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }
    currentPlayer = 'O';
    statusElement.textContent = "Computer's Turn";
    setTimeout(computerMove, 500); // Give a slight delay before computer move
}

function computerMove() {
    const emptyCells = [...cells].filter(cell => !cell.textContent);
    if (emptyCells.length === 0 || !gameActive) return;

    // Check for winning move
    const winningMove = findBestMove('O');
    if (winningMove !== null) {
        emptyCells[winningMove].textContent = 'O';
    } else {
        // Check for blocking move
        const blockingMove = findBestMove('X');
        if (blockingMove !== null) {
            emptyCells[blockingMove].textContent = 'O';
        } else {
            // Random move
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            randomCell.textContent = 'O';
        }
    }
    
    if (checkWin()) {
        statusElement.textContent = "Computer Wins!";
        gameActive = false;
        return;
    }
    if ([...cells].every(cell => cell.textContent)) {
        statusElement.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }
    currentPlayer = 'X';
    statusElement.textContent = "Your Turn";
}

function findBestMove(player) {
    for (const combination of winningCombinations) {
        const cellsToCheck = combination.map(index => cells[index].textContent);
        const emptyCells = combination.filter(index => !cells[index].textContent);

        if (cellsToCheck.filter(cell => cell === player).length === 2 && emptyCells.length === 1) {
            return combination.find(index => !cells[index].textContent);
        }
    }
    return null;
}

function checkWin() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return (
            cells[a].textContent &&
            cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent
        );
    });
}

function restartGame() {
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    statusElement.textContent = "Your Turn";
    gameActive = true;
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartButton.addEventListener('click', restartGame);

// Initialize game status
statusElement.textContent = "Your Turn";
