// Переменные для игры Тетрис
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 25;
const GAME_SPEED = 500;
const gameOverMessage = document.getElementById('game-over');
const scoreElement = document.getElementById('score');
let board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
let currentPiece;
let score = 0;
let gameInterval;

// Фигуры Тетриса
const PIECES = [
  [[1, 1, 1, 1]],  // I
  [[1, 1], [1, 1]], // O
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]], // J
  [[0, 1, 0], [1, 1, 1]]  // T
];

// Начало игры
function startTetris() {
  document.getElementById('game-container').style.display = 'block';
  resetGame();
  gameInterval = setInterval(updateGame, GAME_SPEED);
  document.addEventListener('keydown', handleKeyPress);
}

// Сброс игры
function resetGame() {
  board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
  currentPiece = generatePiece();
  score = 0;
  gameOverMessage.style.display = 'none';
  scoreElement.textContent = `Очки: ${score}`;
  clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, GAME_SPEED);
}

// Генерация новой фигуры
function generatePiece() {
  const pieceType = PIECES[Math.floor(Math.random() * PIECES.length)];
  return { shape: pieceType, x: Math.floor(COLUMNS / 2) - Math.floor(pieceType[0].length / 2), y: 0 };
}

// Обновление игры
function updateGame() {
  movePieceDown();
  if (isGameOver()) {
    clearInterval(gameInterval);
    gameOverMessage.style.display = 'block';
  }
}

// Проверка на окончание игры
function isGameOver() {
  return currentPiece.y === 0 && !isValidMove(currentPiece);
}

// Движение фигуры вниз
function movePieceDown() {
  const newPiece = { ...currentPiece, y: currentPiece.y + 1 };
  if (isValidMove(newPiece)) {
    currentPiece = newPiece;
  } else {
    placePiece();
    removeFullRows();
    currentPiece = generatePiece();
  }
  draw();
}

// Проверка на допустимость хода
function isValidMove(piece) {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col] && (board[piece.y + row] && board[piece.y + row][piece.x + col]) !== null) {
        return false;
      }
    }
  }
  return true;
}

// Размещение фигуры на поле
function placePiece() {
  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[row].length; col++) {
      if (currentPiece.shape[row][col]) {
        board[currentPiece.y + row][currentPiece.x + col] = 'filled';
      }
    }
  }
}

// Удаление полных строк
function removeFullRows() {
  board = board.filter(row => row.includes(null));
  while (board.length < ROWS) {
    board.unshift(Array(COLUMNS).fill(null));
  }
  score += 100;
  scoreElement.textContent = `Очки: ${score}`;
}

// Отрисовка игры
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = COLUMNS * BLOCK_SIZE;
  canvas.height = ROWS * BLOCK_SIZE;

  // Рисуем блоки
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      if (board[row][col]) {
        ctx.fillStyle = '#333';
        ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }

  // Рисуем текущую фигуру
  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[row].length; col++) {
      if (currentPiece.shape[row][col]) {
        ctx.fillStyle = '#0d6efd';
        ctx.fillRect((currentPiece.x + col) * BLOCK_SIZE, (currentPiece.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeRect((currentPiece.x + col) * BLOCK_SIZE, (currentPiece.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

// Обработка нажатий клавиш
function handleKeyPress(event) {
  if (event.key === 'ArrowLeft') {
    const newPiece = { ...currentPiece, x: currentPiece.x - 1 };
    if (isValidMove(newPiece)) {
      currentPiece = newPiece;
    }
  } else if (event.key === 'ArrowRight') {
    const newPiece = { ...currentPiece, x: currentPiece.x + 1 };
    if (isValidMove(newPiece)) {
      currentPiece = newPiece;
    }
  } else if (event.key === 'ArrowDown') {
    movePieceDown();
  } else if (event.key === 'ArrowUp') {
    const newPiece = { ...currentPiece, shape: rotatePiece(currentPiece.shape) };
    if (isValidMove(newPiece)) {
      currentPiece = newPiece;
    }
  }
}

// Поворот фигуры
function rotatePiece(piece) {
  return piece[0].map((_, index) => piece.map(row => row[index])).reverse();
}

// Закрытие модального окна с играми
function closeGamesModal() {
  document.getElementById('games-modal').style.display = 'none';
}

// Показать модальное окно с играми
function showGames() {
  document.getElementById('games-modal').style.display = 'block';
}

// Показать сообщение
function showMessage(category, event) {
  event.preventDefault();
  document.getElementById('modal-title').textContent = category;
  document.getElementById('modal-message').textContent = 'Здесь будет информация по выбранной теме.';
  document.getElementById('modal').style.display = 'block';
}

// Закрытие модального окна
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}