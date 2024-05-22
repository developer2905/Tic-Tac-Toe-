const statusDisplay = document.querySelector('.game--status');
const setupDisplay = document.querySelector('.game--setup');
const playerChoiceButtons = document.querySelectorAll('.player-choice');
const gameBoard = document.querySelector('.game--board');
const restartButton = document.querySelector('.game--restart');

let gameActive = false;
let currentPlayer = "X";
let playerX = "X";
let playerO = "O";
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === playerX ? playerO : playerX;
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    let winningPlayer = null;
    let winningPattern = null;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') continue;
        if (a === b && b === c) {
            roundWon = true;
            winningPlayer = a; // Store the winning player
            winningPattern = winCondition; // Store the winning pattern
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        const winningIcon = winningPlayer === 'X' ? '😊' : '😎'; // Smiley icons for X and O
        // Highlight the winning pattern
        winningPattern.forEach(index => {
            const winningCell = document.querySelector(`.cell[data-cell-index="${index}"]`);
            winningCell.classList.add('winning-cell');
        });
        // Display the popup message
        const popupMessage = document.getElementById('popup-message');
        popupMessage.innerHTML = `Player ${winningPlayer} has won! ${winningIcon}`;
        const popup = document.getElementById('popup');
        popup.style.display = 'block';
        return;
    }

    const roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

// Close the popup when the close button is clicked
document.getElementById('close').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
});


function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive)
        return;

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = false;
    currentPlayer = playerX;
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    setupDisplay.style.display = 'block';
    gameBoard.style.display = 'none';
    restartButton.style.display = 'none';
}

function handlePlayerChoice(event) {
    const selectedPlayer = event.target.getAttribute('data-player');
    playerX = selectedPlayer;
    playerO = selectedPlayer === "X" ? "O" : "X";
    currentPlayer = playerX;
    gameActive = true;
    setupDisplay.style.display = 'none';
    gameBoard.style.display = 'grid';
    restartButton.style.display = 'block';
    statusDisplay.innerHTML = currentPlayerTurn();
}

playerChoiceButtons.forEach(button => button.addEventListener('click', handlePlayerChoice));
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);

// Initial display setup
setupDisplay.style.display = 'block';
gameBoard.style.display = 'none';
restartButton.style.display = 'none';
