const socket = io();
const chess = new Chess()
let sourceSquare;
let draggedPiece;
let playerRole;
const boardElement = document.querySelector('.chessboard')
const resetBtn = document.querySelector('#resetBtn')
const turnBtn = document.querySelector('#turnBtn');



resetBtn.addEventListener("click", () => {
    socket.emit("resetGame");
    socket.on("resetClick", () => {
        showToast("Game reset!", "warning");
    })
});

socket.on("turn", (turn) => {
    turnBtn.textContent = turn === "w" ? "White's Turn" : "Black's Turn";
});



const renderBoard = () => {
    const board = chess.board()
    boardElement.innerHTML = ""

    playerRole === "b" ? boardElement.classList.add("flipped") : boardElement.classList.remove("flipped")


    board.forEach((row, rowIdx) => {
        row.forEach((square, squareIdx) => {

            const squaresquare = document.createElement("div")
            squaresquare.classList.add("square", (rowIdx + squareIdx) % 2 === 0 ? "light" : "dark")

            squaresquare.dataset.row = rowIdx
            squaresquare.dataset.col = squareIdx

            if (square) {
                //problem 
                const pieceElement = document.createElement("div")
                pieceElement.classList.add("piece", square.color === "w" ? "white" : "black")
                pieceElement.innerHTML = getPeiceUnicode(square);

                pieceElement.draggable = playerRole === square.color

                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement
                        sourceSquare = { row: rowIdx, col: squareIdx };
                        e.dataTransfer.setData("text/plain", "")
                    }
                })
                pieceElement.addEventListener("dragend", (e) => {
                    draggedPiece = null
                    sourceSquare = null
                })
                squaresquare.appendChild(pieceElement)
            }
            squaresquare.addEventListener("dragover", (e) => { e.preventDefault() })
            squaresquare.addEventListener("drop", (e) => {
                e.preventDefault()
                if (draggedPiece) {
                    const targetSource = {
                        row: Number.parseInt(squaresquare.dataset.row),
                        col: Number.parseInt(squaresquare.dataset.col),
                    }
                    handleMove(sourceSquare, targetSource)
                }
            })
            boardElement.appendChild(squaresquare)
        })
    })
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
    playerRole = role
    renderBoard()
})

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








const showToast = (message, type = "success", ms = 2500) => {
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

