const { WebSocketServer } = require('ws')

const wss = new WebSocketServer({ port: 8080 })

let grid;

wss.on('connection', (ws) => {
  console.log('New player connected!');

  ws.on('message', (data) => {
    console.log(`Received: ${data}`);
    grid = JSON.parse(data)
    console.log(grid)
    console.log()
    const win = JSON.stringify(
        {   'grid': grid,
            'win': checkWin()})
    
    ws.send(win);

    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // 1 means OPEN
        client.send(win);
      }
    });
  });
});

function checkWin() {
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
