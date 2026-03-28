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
            grid[e.target.dataset.x][e.target.dataset.y].innerText = 'X';
            win = checkWin()
            if (win !== false) endGame(win)
            // turn = turn == 'X' ? 'O' : 'X'
            table.removeEventListener('click', click)
            let move = getMinimaxMove(grid, false)
            table.addEventListener('click', click)
        }
    }
}

function getMinimaxMove(grid, maximizingPlayer, depth=9) {

}

function minimax(grid, maximizingPlayer, depth=9) {

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
