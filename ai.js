const table = document.querySelector('table')
const resetBtn = document.createElement('button')
const caption = document.createElement('caption')
const xwincount = document.getElementById('x-win-count')
const owincount = document.getElementById('o-win-count')
let grid = [['', '', ''], ['', '', ''], ['', '', '']]
let displayGrid = []
let turn = 'X';

resetBtn.innerText = 'Play Again'
resetBtn.classList.add('hidden')
resetBtn.addEventListener('click', reset)
table.after(resetBtn)
table.addEventListener('click', click)
caption.classList.add('win')
makeTable();

function makeTable() {
    table.innerText = ''
    for (let i = 0; i < 3; i++) {
        displayGrid.push([])
        const row = document.createElement('tr')
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('td')
            cell.dataset.x = i; cell.dataset.y = j
            row.appendChild(cell)
            displayGrid[i].push(cell)
        }
        table.appendChild(row)
    }
    table.caption = caption
}

function reset() {
    caption.innerText = ''
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            displayGrid[i][j].innerText = ''
            grid[i][j] = ''
        }
    }
    turn = 'X'
    table.addEventListener('click', click)
    hideBtn()
}

function showBtn() {
    resetBtn.classList.remove('hidden')
    resetBtn.classList.add('block')
}

function hideBtn() {
    resetBtn.classList.add('hidden')
    resetBtn.classList.remove('block')
}

function endGame(win) {
    table.removeEventListener('click', click)
    if (win != '') {
        caption.innerText = `${win} won!!`
        if (win == 'X') {
            xwincount.innerText = 'X: ' + String(Number(xwincount.innerText.split(' ')[1])+1)
        } else {
            owincount.innerText = 'O: ' + String(Number(owincount.innerText.split(' ')[1]+1))
        }
    } else {
        caption.innerText = `Tie!!`
    }
    showBtn()
}

function click(e) {
    if (e.target != table) {
        if (e.target.innerText == '') {
            grid[e.target.dataset.x][e.target.dataset.y] = 'X'
            displayGrid[e.target.dataset.x][e.target.dataset.y].innerText = 'X';
            win = checkWin(grid)
            if (win !== false) {
                endGame(win)
                return;
            }
            table.removeEventListener('click', click)
            let move = getMinimaxMove(grid, false)
            console.log('best move: ', move)
            grid[move[0]][move[1]] = 'O'
            displayGrid[move[0]][move[1]].innerText = 'O'
            win = checkWin(grid)
            if (win !== false) {
                endGame(win)
                return
            }
            table.addEventListener('click', click)
        }
    }
}

function getMinimaxMove(grid, maximizingPlayer) {
    let children = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i][j] == '') {
                children.push([i, j])
            }
        }
    }

    let bestScore
    let bestMove = children[0]
    
    if (maximizingPlayer) {
        bestScore = -10
        for (const child of children) {
            let newGrid = playMove(grid, child, 'X')
            let score = minimax(newGrid, false)
            if (score > bestScore) {
                bestScore = score
                bestMove = child
            }
        }
    } else {
        bestScore = 10
        for (const child of children) {
            let newGrid = playMove(grid, child, 'O')
            let score = minimax(newGrid, true)
            if (score < bestScore) {
                bestScore = score
                bestMove = child
            }
        }
    }

    console.log('score: ', bestScore)

    return bestMove
}

function minimax(grid, maximizingPlayer) {
    const win = checkWin(grid)
    // if (depth == 0 || (win !== false)) {
    if (win !== false) {
        return getScore(grid)
    }

    let children = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i][j] == '') {
                children.push([i, j])
            }
        }
    }

    let bestScore;
    let bestMove = children[0]
    
    if (maximizingPlayer) {
        bestScore = -10
        for (const child of children) {
            let newGrid = playMove(grid, child, 'X')
            let score = minimax(newGrid, false)
            if (score > bestScore) {
                bestScore = score
                bestMove = child
            }
        }
    } else {
        bestScore = 10
        for (const child of children) {
            let newGrid = playMove(grid, child, 'O')
            let score = minimax(newGrid, true)
            if (score < bestScore) {
                bestScore = score
                bestMove = child
            }
        }
    }

    return bestScore
}

function playMove(grid, move, turn) {
    let newGrid = []
    for (let i = 0; i < 3; i++) {
        newGrid.push([])
        for (let j = 0; j < 3; j++) {
            if (i == move[0] && j == move[1]) {
                newGrid[i].push(turn)
            } else {
                newGrid[i].push(grid[i][j])
            }
        }
    }

    return newGrid
}

function getScore(grid) {
    const win = checkWin(grid)
    if (win == 'X') return 1
    if (win == 'O') return -1
    return 0
}

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
