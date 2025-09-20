const express = require('express')
const path = require('path')
const http = require('http')
const socket = require('socket.io')
const { Chess } = require('chess.js')

const app = express()
const server = http.createServer(app)
const io = socket(server)
//sending anything to frontend use -> io.emit and on recive -> io.on


app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')


const chess = new Chess()
const players = {}
let currentPlayer = "w"
let role;



app.get('/', (req, res) => {
  res.render('index.ejs', { title: "Custom Chess Game" })
})



io.on("connection", (un_socket) => {
  const playerId = un_socket.id
  // send current board to the new player only
  un_socket.emit("boardState", chess.fen());


  un_socket.on("resetGame", () => {
    chess.reset();
    currentPlayer = "w";
    io.emit("boardState", chess.fen());
    io.emit("resetClick", "Game reset")
    io.emit("turn", chess.turn());
  });


  if (!players.white) {
    players.white = playerId
    role = "White"
    un_socket.emit("playerRole", "w")
  } else if (!players.black) {
    players.black = playerId
    role = "Black"
    un_socket.emit("playerRole", "b")
    un_socket.emit("startMsg", "start the game")
  } else {
    un_socket.emit("spectatorRole")
    role = "spectator"
  }

  io.emit("connected", `${role} Connected`)


  un_socket.on("move", (move) => {
    try {

      if (chess.turn() === "w" && playerId !== players.white) return
      if (chess.turn() === "b" && playerId !== players.black) return

      const result = chess.move(move)
      if (result) {
        currentPlayer = chess.turn()

        io.emit("move", move)
        io.emit("boardState", chess.fen())
        io.emit("turn", chess.turn());


      } else {
        console.log("Invalid move!");
        un_socket.emit("moveError", "Invalid move!");
      }
    } catch (err) {
      un_socket.emit("moveError", "Invalid move!");
    }
  })


  un_socket.on("disconnect", () => {
    if (playerId === players.white) { role = "White"; delete players.white }
    else if (playerId === players.black) { role = "Black"; delete players.black }

    io.emit("disconnected", `${role} disconnected`)
  })

})


server.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})
