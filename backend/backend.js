const { WebSocketServer } = require('ws')

const wss = new WebSocketServer({ port: 8080 })

const players = new Map()
const games = new Map()

wss.on('connection', (ws) => {
  const playerId = Math.random().toString(36).substring(2, 9)
  let player;
  let turn = players.size % 2 == 0 ? 'X' : 'O'
  let gameId;
  let game;
  // let oppPlayer;
  players.set(playerId, {
    id: playerId,
    socket: ws,
    turn: turn,
    gameId: undefined
  })
  player = players.get(playerId)

  console.log(`Player ${playerId} connected. Total: ${players.size}`);

  console.log('Adding to game')
  // Start new game room
  if (players.size % 2 == 1) {
    gameId = Math.random().toString(36).substring(2, 9)
    games.set(gameId, {
        player1: playerId,
        player2: null,
        grid: [['', '', ''], ['', '', ''], ['', '', '']]
    })
    player.gameId = gameId
    ws.send(JSON.stringify({
      turn: 'X'
    }))
  } else {
    // Add to existing game room
    gameId = Array.from(games.keys()).at(-1)
    games.get(gameId).player2 = playerId
    ws.send(JSON.stringify({
      turn: 'O',
      startGame: true
    }))
    players.get(games.get(gameId).player1).socket.send(JSON.stringify({ startGame:  true }))
    player.gameId = gameId
  }

  game = games.get(gameId)

  console.log('Current Games:')
  console.log(games)

  ws.on('message', (data) => {
    console.log(`Received: ${data}`);
    data = JSON.parse(data)
    let move = data.move
    console.log(move)
    console.log()
    if (game.grid[move[0]][move[1]] == '') {
        game.grid[move[0]][move[1]] = turn
    } else {
        ws.send(JSON.stringify('Error! Cannot move there'))
        return;
    }
    console.log(game.grid)
    const win = checkWin(game.grid)

    let oppPlayer;
    if (players.get(playerId).turn == 'X') {
      oppPlayer = players.get(game.player2)
    } else {
      oppPlayer = players.get(game.player1)
    }

    oppPlayer.socket.send(JSON.stringify({ oppMove: move }))

    if (win !== false) {
      game.grid = [['', '', ''], ['', '', ''], ['', '', '']]
      ws.send(JSON.stringify({ win: win }))
      oppPlayer.socket.send(JSON.stringify({ win: win }))
    }
  });

  ws.on('close', () => {
    if (turn == 'X') {
      game.player1 = null
    } else {
      game.player2 = null
    }
    players.delete(playerId);
    console.log(`Player ${playerId} left.`);
    console.log('Players:')
    console.log(players)
    console.log('Games:')
    console.log(games)
  }); 
});

function checkWin(grid) {
    let tie = true;
    for (let i = 0; i < 3; i++) {
        if (grid[i][0] != '') {
            if (grid[i].every(val => val == grid[i][0])) return grid[i][0]
        }
        if (grid[0][i] != '') {
            if (grid[0][i] == grid[1][i] && grid[1][i] == grid[2][i]) return grid[0][i]
        }
        if (tie) {
            for (let j = 0; j < 3; j++) {
                if (grid[i][j] == '') {
                    tie = false
                    break
                }
            }
        }
    }

    if (grid[0][0] != '') {
        if (grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2]) return grid[0][0]
    }
    
    if (grid[0][2] != '') {
        if (grid[0][2] == grid[1][1] && grid[1][1] == grid[2][0]) return grid[0][2]
    }

    if (tie) return ''

    return false;
}
