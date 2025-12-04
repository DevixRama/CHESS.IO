const socket = io();
const chess = new Chess()
let sourceSquare;
let draggedPiece;
let playerRole;
const boardElement = document.querySelector('.chessboard')
const resetBtn = document.querySelector('#resetBtn')
const turnBtn = document.querySelector('#turnBtn');

console.log(boardElement);


resetBtn.addEventListener("click", () => {
    socket.emit("resetGame");
});


socket.on("resetClick", () => {
    showToast("Game reset!", "warning");
});



socket.on("turn", (turn) => {
    turnBtn.textContent = turn === "w" ? "White's Turn" : "Black's Turn";
});




const renderBoard = () => {
    const board = chess.board();

    board.forEach((row, rowIdx) => {
        row.forEach((col, colIdx) => {
            const squareEl = document.querySelector(`.square[data-row='${rowIdx}'][data-col='${colIdx}']`);
            squareEl.innerHTML = ""; // clear previous piece

            if (col) {
                const pieceEl = document.createElement("div");
                pieceEl.classList.add("piece", col.color === "w" ? "white" : "black");
                pieceEl.innerHTML = getPeiceUnicode(col);
                squareEl.appendChild(pieceEl);
            }
        });
    });
};


function resetSquareColor(squareEl, row, col) {
    const isWhite = (row + col) % 2 === 0;
    squareEl.style.backgroundColor = isWhite ? "#eee" : "#555";
}


let selectedSquare = null;
var audio = new Audio("./assets/clickPeice.mp3");
// var moved = new Audio("./assets/peiceMove.mp3");

boardElement.addEventListener("click", (e) => {
    
    const squareEl = e.target.closest(".square");
    if (!squareEl) return;
    audio.play()

    const row = parseInt(squareEl.dataset.row);
    const col = parseInt(squareEl.dataset.col);

    const piece = chess.get(`${String.fromCharCode(97 + col)}${8 - row}`);

    if (piece && piece.color === playerRole) {
        // Clear previous selection
        if (selectedSquare && selectedSquare.el) {
            resetSquareColor(selectedSquare.el, selectedSquare.row, selectedSquare.col);
            clearHighlights();
        }

        // Select new piece
        selectedSquare = { row, col, el: squareEl };
        squareEl.style.backgroundColor = "#228B22";
        highlightMoves(selectedSquare);

    } else if (selectedSquare) {
        handleMove(selectedSquare, { row, col });
        resetSquareColor(selectedSquare.el, selectedSquare.row, selectedSquare.col);
        selectedSquare = null;
        clearHighlights();
    }
});



function highlightMoves(square) {
    const from = `${String.fromCharCode(97 + square.col)}${8 - square.row}`;
    const moves = chess.moves({ square: from, verbose: true });

    moves.forEach(m => {
        const targetEl = document.querySelector(`.square[data-row='${8 - parseInt(m.to[1])}'][data-col='${m.to.charCodeAt(0) - 97}']`);
        if (targetEl) {
            const marker = document.createElement("div");
            marker.classList.add("move-marker");
            targetEl.appendChild(marker);
        }
    });
}

function clearHighlights() {
    document.querySelectorAll(".move-marker").forEach(el => el.remove());
}


const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: "q"
    }
    socket.emit("move", move)
}


const getPeiceUnicode = (peice) => {
    const unicodePieces = {
        p: "<i class='fas fa-chess-pawn'></i>",
        r: "<i class='fas fa-chess-rook'></i>",
        n: "<i class='fas fa-chess-knight'></i>",
        b: "<i class='fas fa-chess-bishop'></i>",
        q: "<i class='fas fa-chess-queen'></i>",
        k: "<i class='fas fa-chess-king'></i>"
    }
    return unicodePieces[peice.type] || "";
}

renderBoard()

socket.on("playerRole", (role) => {
    playerRole = role;
    if (playerRole === "b") {
        boardElement.classList.add("flipped");
    } else {
        boardElement.classList.remove("flipped");
    }
    renderBoard();
});


socket.on("spectatorRole", () => {
    playerRole = null
    renderBoard()
})

socket.on("boardState", (fen) => {
    chess.load(fen)
    renderBoard()
})

socket.on("move", (move) => {
    chess.move(move)
    renderBoard()
})






const showToast = (message, type = "success", ms = 2000) => {
    Toastify({
        text: message,
        duration: ms,
        gravity: "top",
        position: "right",
        className: type
    }).showToast();
};



socket.on("moveError", (msg) => {
    showToast(msg, "warning");
});

socket.on("disconnected", (msg) => {
    showToast(msg, "error");
});

socket.on("connected", (msg) => {
    showToast(msg, "success");
});

socket.on("startMsg", (msg) => {
    showToast(msg, "success");
});


//Built-in function by socket
socket.on("reconnect_attempt", () => {
    showToast("Reconnecting... Please wait", "warning");
});

