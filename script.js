let boxes = document.querySelectorAll(".box");
let newgame = document.querySelector(".newgame");
let resetscore = document.querySelector(".resetscore");
let message_cont = document.querySelector("#message_cont");
let modeButtons = document.querySelectorAll(".mode");

let turn0 = true;        // true = O's turn, false = X's turn
let gameOver = false;
let mode = "friend";     // "friend", "easy" or "hard"
let scores = { O: 0, X: 0, draw: 0 };

const winPatterns = [[0,1,2],[0,3,6],[0,4,8],[1,4,7],[2,5,8],[2,4,6],[3,4,5],[6,7,8]];


// ---------- when a box is clicked ----------
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        // in computer mode, the human plays only O
        if (mode !== "friend" && turn0 === false) {
            return;
        }
        makeMove(box);

        // now it is the computer's turn (if the game is still on)
        if (mode !== "friend" && gameOver === false) {
            setTimeout(computerMove, 500);
        }
    });
});


// ---------- put O or X in a box ----------
const makeMove = (box) => {
    if (turn0) {
        box.innerText = "O";
        box.classList.add("o");
        turn0 = false;
    } else {
        box.innerText = "X";
        box.classList.add("x");
        turn0 = true;
    }
    box.disabled = true;
    checkWinner();

    if (gameOver === false) {
        message_cont.innerText = (turn0 ? "O" : "X") + "'s turn";
    }
};


// ---------- computer plays X ----------
const computerMove = () => {
    if (gameOver) {
        return;
    }
    let spot = -1;

    if (mode === "hard") {
        spot = findSpot("X");              // 1. can I win now?
        if (spot === -1) {
            spot = findSpot("O");          // 2. can I stop O from winning?
        }
        if (spot === -1 && boxes[4].innerText === "") {
            spot = 4;                      // 3. take the centre
        }
    }
    if (spot === -1) {
        spot = randomEmptyBox();           // otherwise pick a random box
    }
    makeMove(boxes[spot]);
};

// find a box that would complete a line for the given player
const findSpot = (player) => {
    for (let pattern of winPatterns) {
        let values = [
            boxes[pattern[0]].innerText,
            boxes[pattern[1]].innerText,
            boxes[pattern[2]].innerText
        ];
        let count = values.filter((v) => v === player).length;
        let emptyIndex = values.indexOf("");
        if (count === 2 && emptyIndex !== -1) {
            return pattern[emptyIndex];
        }
    }
    return -1;
};

const randomEmptyBox = () => {
    let empty = [];
    for (let i = 0; i < 9; i++) {
        if (boxes[i].innerText === "") {
            empty.push(i);
        }
    }
    return empty[Math.floor(Math.random() * empty.length)];
};


// ---------- enable / disable boxes ----------
const disableboxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enableboxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("o", "x", "win");
    }
};


// ---------- check winner ----------
const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;

        if (pos1val != "" && pos2val != "" && pos3val != "") {
            if (pos1val === pos2val && pos2val === pos3val) {
                showwinner(pos1val, pattern);
                return;
            }
        }
    }

    // no winner: if every box is filled, it is a draw
    let filled = 0;
    for (let box of boxes) {
        if (box.innerText != "") {
            filled++;
        }
    }
    if (filled === 9) {
        showdraw();
    }
};

const showwinner = (winner, pattern) => {
    message_cont.innerText = `Winner is ${winner}`;
    for (let index of pattern) {
        boxes[index].classList.add("win");   // highlight winning boxes
    }
    scores[winner]++;
    updateScore();
    gameOver = true;
    disableboxes();
};

const showdraw = () => {
    message_cont.innerText = "It's a draw!";
    scores.draw++;
    updateScore();
    gameOver = true;
};

const updateScore = () => {
    document.querySelector("#oScore").innerText = scores.O;
    document.querySelector("#xScore").innerText = scores.X;
    document.querySelector("#drawScore").innerText = scores.draw;
};


// ---------- new game / reset ----------
const newGame = () => {
    turn0 = true;
    gameOver = false;
    enableboxes();
    message_cont.innerText = "O's turn";
};

const resetScore = () => {
    scores = { O: 0, X: 0, draw: 0 };
    updateScore();
    newGame();
};

newgame.addEventListener("click", newGame);
resetscore.addEventListener("click", resetScore);


// ---------- choose mode ----------
modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        mode = button.id;
        modeButtons.forEach((b) => b.classList.remove("active"));
        button.classList.add("active");
        resetScore();
    });
});
