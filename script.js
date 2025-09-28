// Game constants
const BOARD_SIZE = 15;
const CELL_SIZE = 40;
const BOARD_PADDING = 50;

// Game state
let board = [];
let currentPlayer = 'black'; // 'black' starts first
let gameOver = false;
let gameMessage = '';

// Canvas elements
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const currentPlayerDisplay = document.getElementById('current-player');
const gameMessageDisplay = document.getElementById('game-message');
const resetButton = document.getElementById('reset-btn');

// Initialize the game
function initGame() {
    // Create empty board
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    
    // Reset game state
    currentPlayer = 'black';
    gameOver = false;
    gameMessage = '';
    
    // Update display
    updateDisplay();
    
    // Draw the empty board
    drawBoard();
    
    // Add event listener for board clicks
    canvas.addEventListener('click', handleCanvasClick);
}

// Draw the game board
function drawBoard() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background color
    ctx.fillStyle = '#e8c49c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let i = 0; i < BOARD_SIZE; i++) {
        const x = BOARD_PADDING + i * CELL_SIZE;
        ctx.beginPath();
        ctx.moveTo(x, BOARD_PADDING);
        ctx.lineTo(x, BOARD_PADDING + (BOARD_SIZE - 1) * CELL_SIZE);
        ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let i = 0; i < BOARD_SIZE; i++) {
        const y = BOARD_PADDING + i * CELL_SIZE;
        ctx.beginPath();
        ctx.moveTo(BOARD_PADDING, y);
        ctx.lineTo(BOARD_PADDING + (BOARD_SIZE - 1) * CELL_SIZE, y);
        ctx.stroke();
    }
    
    // Draw star points (hoshi points) - common in 15x15 boards
    const starPoints = [
        { row: 3, col: 3 }, { row: 3, col: 11 },
        { row: 11, col: 3 }, { row: 11, col: 11 },
        { row: 7, col: 7 }
    ];
    
    ctx.fillStyle = '#333';
    starPoints.forEach(point => {
        const x = BOARD_PADDING + point.col * CELL_SIZE;
        const y = BOARD_PADDING + point.row * CELL_SIZE;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw pieces
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const piece = board[row][col];
            if (piece) {
                drawPiece(col, row, piece);
            }
        }
    }
}

// Draw a single piece
function drawPiece(col, row, color) {
    const x = BOARD_PADDING + col * CELL_SIZE;
    const y = BOARD_PADDING + row * CELL_SIZE;
    
    ctx.beginPath();
    ctx.arc(x, y, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    
    // Create gradient for 3D effect
    const gradient = ctx.createRadialGradient(
        x - 3, y - 3, 2,
        x, y, CELL_SIZE / 2 - 2
    );
    
    if (color === 'black') {
        gradient.addColorStop(0, '#000');
        gradient.addColorStop(1, '#666');
    } else {
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, '#ccc');
    }
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
}

// Handle canvas clicks
function handleCanvasClick(event) {
    if (gameOver) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Find closest grid position
    const col = Math.round((x - BOARD_PADDING) / CELL_SIZE);
    const row = Math.round((y - BOARD_PADDING) / CELL_SIZE);
    
    // Check if the position is valid and empty
    if (col >= 0 && col < BOARD_SIZE && row >= 0 && row < BOARD_SIZE && board[row][col] === null) {
        // Place the piece
        board[row][col] = currentPlayer;
        
        // Draw the placed piece
        drawPiece(col, row, currentPlayer);
        
        // Check for win
        if (checkWin(row, col)) {
            gameOver = true;
            gameMessage = `${currentPlayer === 'black' ? 'Black' : 'White'} wins!`;
            gameMessageDisplay.textContent = gameMessage;
            gameMessageDisplay.className = 'message winner-message';
        } else {
            // Switch player
            currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
            updateDisplay();
        }
    }
}

// Check for win condition
function checkWin(row, col) {
    const player = board[row][col];
    
    // Check in 4 directions: horizontal, vertical, and two diagonals
    const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonal /
        [1, -1]   // diagonal \
    ];
    
    for (const [dx, dy] of directions) {
        let count = 1; // Count the current piece
        
        // Check in positive direction
        for (let i = 1; i < 5; i++) {
            const r = row + i * dx;
            const c = col + i * dy;
            if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                count++;
            } else {
                break;
            }
        }
        
        // Check in negative direction
        for (let i = 1; i < 5; i++) {
            const r = row - i * dx;
            const c = col - i * dy;
            if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                count++;
            } else {
                break;
            }
        }
        
        if (count >= 5) {
            return true;
        }
    }
    
    return false;
}

// Update display elements
function updateDisplay() {
    currentPlayerDisplay.textContent = currentPlayer === 'black' ? 'Black' : 'White';
    gameMessageDisplay.textContent = gameMessage;
    gameMessageDisplay.className = 'message';
}

// Reset the game
function resetGame() {
    initGame();
}

// Initialize the event listeners
resetButton.addEventListener('click', resetGame);

// Start the game
window.onload = initGame;