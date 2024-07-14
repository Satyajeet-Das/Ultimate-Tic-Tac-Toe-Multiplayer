let uttBoard = Array.from({ length: 9 }, () => Array(9).fill("_"));
let board = Array(9).fill("_");
const WINS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let currentBoard = -1;
const p1 = "X";
const p2 = "O";

function win(player) {
  const win_state = [
    [board[0], board[1], board[2]],
    [board[3], board[4], board[5]],
    [board[6], board[7], board[8]],
    [board[0], board[3], board[6]],
    [board[1], board[4], board[7]],
    [board[2], board[5], board[8]],
    [board[0], board[4], board[8]],
    [board[2], board[4], board[6]],
  ];
  return win_state.some((state) => state.every((cell) => cell === player));
}

function boardWin(x, player) {
  const win_state = [
    [uttBoard[x][0], uttBoard[x][1], uttBoard[x][2]],
    [uttBoard[x][3], uttBoard[x][4], uttBoard[x][5]],
    [uttBoard[x][6], uttBoard[x][7], uttBoard[x][8]],
    [uttBoard[x][0], uttBoard[x][3], uttBoard[x][6]],
    [uttBoard[x][1], uttBoard[x][4], uttBoard[x][7]],
    [uttBoard[x][2], uttBoard[x][5], uttBoard[x][8]],
    [uttBoard[x][0], uttBoard[x][4], uttBoard[x][8]],
    [uttBoard[x][2], uttBoard[x][4], uttBoard[x][6]],
  ];
  return win_state.some((state) => state.every((cell) => cell === player));
}

function boardDraw(x) {
  const empty = uttBoard[x].filter((cell) => cell === "_").length;
  if (empty === 0 && !boardWin(x, "X") && !boardWin(x, "O")) {
    return true;
  } else {
    return false;
  }
}

function gameOver() {
  const empty = board.filter((cell) => cell === "_").length;

  if (win("X") || win("O") || empty === 0) {
    return true;
  }
  return false;
}

function boardChange(y) {
  return board[y] === "_" ? y : -1;
}

function nextCells(cb) {
  const cells = [];
  if (cb === -1) {
    uttBoard.forEach((row, x) => {
      row.forEach((cell, y) => {
        if (cell === "_" && board[x] == "_") {
          cells.push([x, y]);
        }
      });
    });
  } else if (board[cb] === "_") {
    uttBoard[cb].forEach((cell, y) => {
      if (cell === "_") {
        cells.push([cb, y]);
      }
    });
  }
  return cells;
}

function validMove(x, y, cb) {
  return nextCells(cb).some((cell) => cell[0] === x && cell[1] === y);
}

function setMove(x, y, player, cb) {
  if (validMove(x, y, cb)) {
    uttBoard[x][y] = player;
    return true;
  }
  return false;
}

function xHoverIn() {
  const outlineContainer = this.querySelector(".x-outline-container");
  if (outlineContainer) {
    outlineContainer.style.display = "block";
  }
}

function xHoverOut() {
  const outlineContainer = this.querySelector(".x-outline-container");
  if (outlineContainer) {
    outlineContainer.style.display = "none";
  }
}

function oHoverIn() {
  const outlineContainer = this.querySelector(".o-outline-container");
  if (outlineContainer) {
    outlineContainer.style.display = "block";
  }
}

function oHoverOut() {
  const outlineContainer = this.querySelector(".o-outline-container");
  if (outlineContainer) {
    outlineContainer.style.display = "none";
  }
}

let moves = 0;
const boxes = document.querySelectorAll(".box");

function highlightValidMoves() {
  boxes.forEach((box) => {
    box.classList.remove("highlight");
    box.removeEventListener("mouseenter", xHoverIn);
    box.removeEventListener("mouseleave", xHoverIn);
    box.removeEventListener("mouseenter", oHoverIn);
    box.removeEventListener("mouseleave", oHoverOut);
  });

  const valid = nextCells(currentBoard);
  valid.forEach((v) => {
    const id = v[0] + 1 + "-" + (v[1] + 1);
    const box = document.getElementById(id);
    console.log(id);
    console.log(box);
    box.classList.add("highlight");

    if (moves % 2 === 0) {
      box.addEventListener("mouseenter", xHoverIn);
      box.addEventListener("mouseleave", xHoverOut);
    } else {
      box.addEventListener("mouseenter", oHoverIn);
      box.addEventListener("mouseleave", oHoverOut);
    }
  });
}

highlightValidMoves();
for (let i = 0; i < boxes.length; i++) {
  boxes[i].addEventListener("click", () => {
    const id = boxes[i].id;
    // console.log(this);
    console.log(id);
    const x = parseInt(id[0]);
    const y = parseInt(id[2]);
    if (validMove(x - 1, y - 1, currentBoard)) {
      if (moves % 2 === 0) {
        const clickedBox = boxes[i].querySelector(".x-container");
        clickedBox.style.display = "block";
        uttBoard[x - 1][y - 1] = "X";
      } else {
        const clickedBox = boxes[i].querySelector(".o-container");
        clickedBox.style.display = "block";
        uttBoard[x - 1][y - 1] = "O";
      }

      if (moves % 2 === 0 && boardWin(x - 1, "X")) {
        board[x - 1] = "X";
        const bigBox = document.getElementById(x);
        const bigX = bigBox.querySelector(".big-x");
        bigBox.style.display = "block";
        bigX.style.display = "block";
      } else if (moves % 2 === 1 && boardWin(x - 1, "O")) {
        board[x - 1] = "O";
        const bigBox = document.getElementById(x);
        const bigO = bigBox.querySelector(".big-o");
        bigBox.style.display = "block";
        bigO.style.display = "block";
      } else if (boardDraw(x - 1)) {
        board[x - 1] = -1;
        const bigBox = document.getElementById(x);
        const bigX = bigBox.querySelector(".big-x");
        const bigO = bigBox.querySelector(".big-o");
        bigBox.style.display = "block";
        bigX.style.display = "block";
        bigO.style.display = "block";
      }

      currentBoard = boardChange(y - 1);
      console.log(currentBoard);
      moves++;
      highlightValidMoves();

      if (gameOver()) {
        boxes.forEach((box) => {
          box.classList.remove("highlight");
          box.removeEventListener("mouseenter", xHoverIn);
          box.removeEventListener("mouseleave", xHoverIn);
          box.removeEventListener("mouseenter", oHoverIn);
          box.removeEventListener("mouseleave", oHoverOut);
        });
        if (win(p1)) {
          console.log("X won");
        } else if (win(p2)) {
          console.log("O won");
        } else {
          console.log("Draw");
        }
      }
    }
  });
}

function startTimer(duration, display) {
  let timer = duration;
  let minutes, seconds;
  setInterval(function () {
      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
          timer = 0;
          // timer = duration; // uncomment this line to reset timer automatically after reaching 0
      }
  }, 1000);
}

function stopTimer(display){
  clearInterval(display);
}

let time = 120; // your time in seconds here
const time1 = document.querySelector('#player1-time');
const time2 = document.querySelector('#player2-time');
startTimer(time, time1);

// function displayBoard() {
//     for (let row_block = 0; row_block < 3; row_block++) {
//         for (let row = 0; row < 3; row++) {
//             let line = '';
//             for (let col_block = 0; col_block < 3; col_block++) {
//                 for (let col = 0; col < 3; col++) {
//                     let index = `${row_block * 30 + col_block * 10 + row * 3 + col}`;
//                     line += `${uttBoard[parseInt(index[0])][parseInt(index[1])]} `;
//                 }
//                 if (col_block < 2) {
//                     line += '  ';
//                 }
//             }
//             console.log(line);
//         }
//         console.log('');
//     }
// }

// function clean() {
//     const os_name = process.platform;
//     if (os_name.startsWith('win')) {
//         exec('cls');
//     } else {
//         exec('clear');
//     }
// }

// function main() {
//     clean();
//     let moves = 0;

//     function gameLoop() {
//         if (gameOver()) {
//             if (win(p1)) {
//                 console.log(`${p1} Won`);
//             } else if (win(p2)) {
//                 console.log(`${p2} Won`);
//             } else {
//                 console.log('Draw');
//             }
//             rl.close();
//             return;
//         }

//         clean();
//         const currentPlayer = moves % 2 === 0 ? p1 : p2;

//         console.log(currentBoard);
//         rl.question(`Enter your move ${currentPlayer}: `, input => {
//             const [x, y] = input.split(' ').map(Number);

//             if (!validMove(x, y, currentBoard)) {
//                 gameLoop();
//                 return;
//             }

//             setMove(x, y, currentPlayer, currentBoard);

//             if (boardWin(x, currentPlayer)) {
//                 board[x] = currentPlayer;
//             }

//             currentBoard = boardChange(y);

//             displayBoard();
//             moves++;
//             setTimeout(gameLoop, 500);
//         });
//     }

//     gameLoop();
// }

// main();
