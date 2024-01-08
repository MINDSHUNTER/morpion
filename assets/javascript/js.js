document.addEventListener("DOMContentLoaded", function () {
    let gameBoard = document.querySelector("#game-board");
    let commentDiv = document.querySelector(".comment");
    let replayButton = document.querySelector("#replay-btn");
    let playButton = document.querySelector("#startButton");
    let cpuButton = document.querySelector("#cpuButton");
    let isPlayerOne = true;
    let gridSize = 3;
    let cpuMode = true;
    let canPlay = true

    replayButton.addEventListener('click', () => {
        cpuButton.style.display="block";
        commentDiv.innerHTML="Enjoy the game";
        playButton.style.display="block";
        gameBoard.style.display="none"
        canPlay = true;
        replay()
    });
    
    playButton.addEventListener('click', () => {
        cpuButton.style.display="none"
        cpuMode = false
        startGame();
    });

    cpuButton.addEventListener('click', () => {
        cpuMode = true;
        cpuButton.style.display="none"
        startGame();
    });

    function startGame() {
        playButton.style.display = "none";
        gameBoard.style.display = "grid"; 
        replayButton.style.display="block"
    }

    function createCell(row, col) {
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.setAttribute("data-row", row);
        cell.setAttribute("data-col", col);
        return cell;
    }

    function createGrid() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                let cell = createCell(i, j);
                gameBoard.appendChild(cell);
                cell.addEventListener("click", () => {
                    if (canPlay && cell.innerHTML === "") {
                        play(cell);
                        if (checkWin()) {
                            commentDiv.textContent = isPlayerOne ? "Player ✖️ wins!" : "Player ⭕ wins!";
                            replayButton.style.display = "block";
                            canPlay = false;
                        } else if (checkDraw()) {
                            commentDiv.textContent = "It's a draw!";
                            replayButton.style.display = "block";
                        } else if (!isPlayerOne && cpuMode === true && !checkWin()) {
                            canPlay = false
                            setTimeout(makeComputerMove, 500);
                        }
                    }

                });
            }
        }
    }

    function play(cell) {
        if (isPlayerOne) {
            cell.innerHTML = "⭕";
        } else {
            cell.innerHTML = "✖️";
        }
        isPlayerOne = !isPlayerOne;
    }

    function checkWin() {
        let cells = document.querySelectorAll(".cell");

        function checkLine(line) {
            return line.every(cell => cell.innerHTML === "✖️") || line.every(cell => cell.innerHTML === "⭕");
        }

        for (let i = 0; i < gridSize; i++) {
            let row = [];
            for (let j = 0; j < gridSize; j++) {
                row.push(cells[i * gridSize + j]);
            }
            if (checkLine(row)) {
                highlightWinningLine(row);
                return true;
            }
        }

        for (let j = 0; j < gridSize; j++) {
            let col = [];
            for (let i = 0; i < gridSize; i++) {
                col.push(cells[i * gridSize + j]);
            }
            if (checkLine(col)) {
                highlightWinningLine(col);
                return true;
            }
        }
        let mainDiagonal = [];
        let antiDiagonal = [];

        for (let i = 0; i < gridSize; i++) {
            mainDiagonal.push(cells[i * gridSize + i]);
            antiDiagonal.push(cells[i * gridSize + (gridSize - 1 - i)]);
        }
        if (checkLine(mainDiagonal)) {
            highlightWinningLine(mainDiagonal);
            return true;
        }
        
        if (checkLine(antiDiagonal)) {
            highlightWinningLine(antiDiagonal);
            return true;
        }
    
        return false;
    }
     
    function checkDraw() {
        let cells = document.querySelectorAll(".cell");
        let values = [];

        Array.from(cells).forEach(cell => {
            values.push(cell.innerHTML);
        });

        return values.every(value => value === "⭕" || value === "✖️") && !checkWin();
    }
    function replay() {
        gameBoard.innerHTML = "";
        replayButton.style.display = "none";
        isPlayerOne = true;
        createGrid();
    }
    function makeComputerMove() {
        let availableCells = getAvailableCells();
        if (availableCells.length > 0) {
            let randomIndex = Math.floor(Math.random() * availableCells.length);
            let computerCell = availableCells[randomIndex];
            play(computerCell);
            if (checkWin()) {
                commentDiv.textContent = "Player ✖️ wins!";
                replayButton.style.display = "block";
            } else if (checkDraw()) {
                commentDiv.textContent = "It's a draw!";
                replayButton.style.display = "block";
            }
        }
         canPlay = true
    }

    function highlightWinningLine(line) {
        line.forEach(cell => {
            cell.classList.add("winning-cell");
        });
    }

    function getAvailableCells() {
        let cells = document.querySelectorAll(".cell");
        return Array.from(cells).filter(cell => cell.innerHTML === "");
    }
    createGrid();
});
