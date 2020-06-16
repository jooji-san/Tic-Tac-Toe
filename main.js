'use strict'

const players = (function () {
  function player(name, move) {
    return { name, move }
  }
  function getPlayer1() {
    return player1;
  }
  function getPlayer2() {
    return player2;
  }

  let player1;
  let player2;

  const inputsDiv = document.querySelector('.inputs-div')
  const playerNameInputs = inputsDiv.querySelectorAll('input');
  const submitBtn = inputsDiv.querySelector('.submit-btn');
  submitBtn.addEventListener('click', () => {
    if (playerNameInputs[0].value === '' || playerNameInputs[1].value === '') {
      alert('fill out the names');
      return;
    }
    player1 = player(playerNameInputs[0].value, 'O');
    player2 = player(playerNameInputs[1].value, 'X');

    inputsDiv.classList.add('hidden');
  });

  return { getPlayer1, getPlayer2 };
})();

const gameboard = (function () {
  let board;

  function initBoard() {
    board = [null, null, null, null, null, null, null, null, null];
  }

  function setBoard(index, content) {
    board.splice(index, 1, content);
  }

  function getBoard() {
    return board;
  }

  return { initBoard, getBoard, setBoard };
})();

const game = (function () {

  let turnNum = 0;
  function getTurnNum() {
    return turnNum;
  }
  function incrementTurnNum() {
    turnNum++;
  }
  function resetTurnNum() {
    turnNum = 0;
  }

  function isPlayer1Turn() {
    if (turnNum % 2 === 0) {
      return true;
    } else if (turnNum % 2 === 1) {
      return false;
    }
  }

  let value;
  let count = 0;

  function checkRow() {
    let isInRow;
    for (let i = 0; i < 7; i += 3) {
      for (let j = i; j < i + 3; j++) {
        isInRow = changeCount(j);
        if (isInRow) {
          return isInRow;
        }
      }
      count = 0;
    }
  }

  function checkColumn() {
    let isInRow;
    for (let i = 0; i < 3; i++) {
      for (let j = i; j < i + 7; j += 3) {
        isInRow = changeCount(j);
        if (isInRow) {
          return isInRow;
        }
      }
      count = 0;
    }
  }

  function checkDiagonal() {
    let isInRow;
    for (let i = 0; i < 9; i += 4) {
      isInRow = changeCount(i);
      if (isInRow) {
        return isInRow;
      }
    }
    count = 0;

    for (let i = 2; i < 7; i += 2) {
      isInRow = changeCount(i);
      if (isInRow) {
        return isInRow;
      }
    }
    count = 0;
  }

  function changeCount(i) {
    const board = gameboard.getBoard();

    if (board[i]) {
      if (board[i] === value) {
        count++;
        if (count >= 3) {
          count = 0;
          return true;
        }
      } else {
        count = 0;
        value = board[i];
        count++;
      }
    } else {
      count = 0;
    }
  }

  function checkWin() {
    return (checkRow() || checkColumn() || checkDiagonal());
  }

  function getWinner() {
    if (checkWin()) {
      return isPlayer1Turn() ? players.getPlayer1().name : players.getPlayer2().name; // Should it be reversed. Check this
    }
  }

  return { getTurnNum, incrementTurnNum, resetTurnNum, isPlayer1Turn, getWinner };
})();

const displayController = (function () {
  gameboard.initBoard();

  const squares = document.querySelectorAll('.square');
  let board = gameboard.getBoard();

  function render() {
    board = gameboard.getBoard();

    squares.forEach((square, index) => {
      square.textContent = board[index];
    });
  }

  function startNew() {
    displayController.addEventListeners();
    gameboard.initBoard();
    game.resetTurnNum();
    render();
  }

  function addEventListeners() {
    squares.forEach((square) => {
      square.addEventListener('click', handlePlayerClick)
    });
  }

  function removeEventListeners() {
    squares.forEach((square) => {
      square.removeEventListener('click', handlePlayerClick)
    });
  }

  function handlePlayerClick(e) {
    if (board[e.target.classList[1] - 1]) {
      return;
    }

    gameboard.setBoard(
      e.target.classList[1] - 1,
      game.isPlayer1Turn() ? players.getPlayer1().move : players.getPlayer2().move
    );
    render();

    const winnerName = game.getWinner();
    if (winnerName) {
      alert(`The winner is ${winnerName}`);
      removeEventListeners();
    } else if (game.getTurnNum() === 8) {
      alert('tie');
    } else {
      game.incrementTurnNum();
    }
  }

  const startBtn = document.querySelector('.start-btn');
  startBtn.addEventListener('click', startNew);

  return { render, addEventListeners }
})();