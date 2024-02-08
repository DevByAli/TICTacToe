
let divrow00 = document.getElementById("row00");
let divrow01 = document.getElementById("row01");
let divrow02 = document.getElementById("row02");
let divrow10 = document.getElementById("row10");
let divrow11 = document.getElementById("row11");
let divrow12 = document.getElementById("row12");
let divrow20 = document.getElementById("row20");
let divrow21 = document.getElementById("row21");
let divrow22 = document.getElementById("row22");


divrow00.addEventListener('click', () => handleEvent('row00'));
divrow01.addEventListener('click', () => handleEvent('row01'));
divrow02.addEventListener('click', () => handleEvent('row02'));
divrow10.addEventListener('click', () => handleEvent('row10'));
divrow11.addEventListener('click', () => handleEvent('row11'));
divrow12.addEventListener('click', () => handleEvent('row12'));
divrow20.addEventListener('click', () => handleEvent('row20'));
divrow21.addEventListener('click', () => handleEvent('row21'));
divrow22.addEventListener('click', () => handleEvent('row22'));


const EMPTY = '', PLAYER = 'X', AI = 'O';
let board = [[EMPTY, EMPTY, EMPTY],
[EMPTY, EMPTY, EMPTY],
[EMPTY, EMPTY, EMPTY]]


function handleEvent(divId) {
    let myDiv = document.getElementById(divId);
    if (myDiv.innerHTML.trim() === '') {

        // Get the row and column from the divId
        const numbersArray = divId.match(/\d+(\.\d+)?/g);
        const number = Number(numbersArray[0]);
        let row, col;
        if (number < 3) {
            row = 0;
            col = number;
        } else {
            col = number % 10;
            row = Math.floor(number / 10);
        }
        // Getting data from divID id done
        var current_player = PLAYER;
        if (!(TERMINAL_TEST(PLAYER) || TERMINAL_TEST(AI))) {
            board[row][col] = PLAYER;
            myDiv.innerHTML = "<h1>❌</h1>";
        }

        if (!(TERMINAL_TEST(PLAYER) || TERMINAL_TEST(AI))) {
            let best_move = ALPHA_BETA_SEARCH();
            row = best_move.row;
            col = best_move.col;
            board[row][col] = AI;
            current_player = AI;
            let computerDiv = document.getElementById(`row${row}${col}`);
            computerDiv.innerHTML = "<h1>⭕</h1>";
        }
    }
    if (TERMINAL_TEST(current_player)) {
        if (current_player === PLAYER)
            document.getElementById('win').innerHTML = "<h1>You Win!</h1>";
        else if (current_player === AI)
            document.getElementById('win').innerHTML = "<h1>Computer Win!</h1>";
    } else if (is_boardFull()) {
        document.getElementById('win').innerHTML = "<h1>Draw!</h1>";
    }

}


function TERMINAL_TEST(player) {
    // Check rows
    for (let i = 0; i < 3; ++i) {
        if (board[i].every((cell) => cell === player)) {
            return true;
        }
    }

    // Check columns
    for (let j = 0; j < 3; ++j) {
        if (board.every((row) => row[j] === player)) {
            return true;
        }
    }

    // Check diagonals
    return !!((board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
        (board[0][2] === player && board[1][1] === player && board[2][0] === player));
}

function UTILITY() {
    if (TERMINAL_TEST(PLAYER)) {
        return 1;
    }
    else if (TERMINAL_TEST(AI)) {
        return -1;
    }
    return 0;
}

function is_boardFull() {
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            if (board[i][j] === EMPTY)
                return false;
        }
    }
    return true;
}

function MIN_MAX(depth, alpha, beta) {
    if (TERMINAL_TEST(PLAYER)) {
        return 1;
    }
    else if (TERMINAL_TEST(AI)) {
        return -1;
    }
    else if (is_boardFull()) {
        return 0;
    }

    let best_value = -Infinity;

    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            if (board[i][j] === EMPTY) {
                board[i][j] = PLAYER;
                let evaluation = MIN_MAX(depth + 1, alpha, beta);
                board[i][j] = EMPTY;
                best_value = Math.max(best_value, evaluation);
                alpha = Math.max(alpha, evaluation)
                if (beta <= alpha) {
                    break;
                }
            }
        }
    }
    return alpha
}

function ALPHA_BETA_SEARCH() {
    let best_evaluation = -Infinity;
    let best_move = { row: 0, col: 0 };

    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            if (board[i][j] === EMPTY) {
                board[i][j] = AI;
                let evaluation = MIN_MAX(0, -Infinity, Infinity);
                board[i][j] = EMPTY;
                if (evaluation > best_evaluation) {
                    best_evaluation = evaluation;
                    best_move.row = i;
                    best_move.col = j;
                }
            }
        }
    }
    return best_move;
}


// Reset the game
document.getElementById('resetBtn').addEventListener('click', () => {
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            let divId = `row${i}${j}`;
            document.getElementById(divId).innerHTML = '';
            board[i][j] = EMPTY;
        }
    }
    document.getElementById("win").innerHTML = '';
});