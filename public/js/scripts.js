const socket = io();

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

function validMove(clock, x, y, cb) {
  if (clock["player1"] === 0 || clock["player2"] === 0) return false;
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
    box.removeEventListener("mouseleave", xHoverOut);
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

function removeAllHighlights() {
  boxes.forEach((box) => {
    box.classList.remove("highlight");
    box.removeEventListener("mouseenter", xHoverIn);
    box.removeEventListener("mouseleave", xHoverIn);
    box.removeEventListener("mouseenter", oHoverIn);
    box.removeEventListener("mouseleave", oHoverOut);
  });
}

function playerMove(clickedBox, opponentPlayerNo, symbol, opponentTime, x, y) {
  clickedBox.style.display = "block";
  uttBoard[x - 1][y - 1] = symbol;
  stopTimer(player1Time);
  stopTimer(player2Time);
  player2Time = startTimer(playerClock, opponentPlayerNo, opponentTime);
  if (symbol === "X") {
    xTurn.classList.remove("active");
    oTurn.classList.add("active");
  } else if (symbol === "O") {
    oTurn.classList.remove("active");
    xTurn.classList.add("active");
  }
}

function winMsg(element) {
  xTurn.classList.remove("active");
  oTurn.classList.remove("active");
  element.classList.add("active");

  turnMsg.textContent = "Won";
}

function drawMsg() {
  xTurn.classList.remove("active");
  oTurn.classList.remove("active");
  turnMsg.textContent = "Draw";
}

function startTimer(clock, player, display) {
  let timer = clock[player];
  let minutes, seconds;
  const timeId = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;
    timer--;
    clock[player] = timer;

    if (timer < 0) {
      timer = 0;
      clock[player] = timer;
      clearInterval(timeId);
      removeAllHighlights();
      if (player === "player1") {
        console.log("O won");
        winMsg(oTurn);
      } else if (player === "player2") {
        console.log("X won");
        winMsg(oTurn);
      }
      // timer = duration; // uncomment this line to reset timer automatically after reaching 0
    }
  }, 1000);

  return timeId;
}

function stopTimer(timeId) {
  clearInterval(timeId);
}
const time1 = document.getElementById("player1-time");
const time2 = document.getElementById("player2-time");
// console.log(timeVariableP1.innerHTML)
// console.log(timeVariableP2.innerHTML)
var timeP1 = parseInt(time1.innerHTML[1]) * 60 + parseInt(time1.innerHTML[0]);
var timeP2 = parseInt(time2.innerHTML[1]) * 60 + parseInt(time2.innerHTML[0]);
console.log(timeP1 + " " + timeP2);
const playerClock = {
  player1: timeP1,
  player2: timeP2,
};

const xTurn = document.getElementById("x-turn");
const oTurn = document.getElementById("o-turn");
const turnMsg = document.getElementById("turn-msg");

let player1Time = startTimer(playerClock, "player1", time1);
let player2Time;
highlightValidMoves();
for (let i = 0; i < boxes.length; i++) {
  boxes[i].addEventListener("click", () => {
    const id = boxes[i].id;
    // console.log(this);
    console.log(id);
    const x = parseInt(id[0]);
    const y = parseInt(id[2]);
    if (validMove(playerClock, x - 1, y - 1, currentBoard)) {
      if (moves % 2 === 0) {
        const clickedBox = boxes[i].querySelector(".x-container");
        playerMove(clickedBox, "player2", "X", time2, x, y);
      } else {
        const clickedBox = boxes[i].querySelector(".o-container");
        playerMove(clickedBox, "player1", "O", time1, x, y);
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
        stopTimer(player1Time);
        stopTimer(player2Time);
        removeAllHighlights();
        if (win(p1)) {
          console.log("X won");
          winMsg(xTurn);
        } else if (win(p2)) {
          console.log("O won");
          winMsg(oTurn);
        } else {
          console.log("Draw");
          drawMsg();
        }
      }
    }
  });
}

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
