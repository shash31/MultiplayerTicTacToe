const table = document.querySelector('table')
const resetBtn = document.createElement('button')
const caption = document.createElement('caption')
const xwincount = document.getElementById('x-win-count')
const owincount = document.getElementById('o-win-count')
let grid = []
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
        grid.push([])
        const row = document.createElement('tr')
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('td')
            cell.dataset.x = i; cell.dataset.y = j
            row.appendChild(cell)
            grid[i].push(cell)
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
            grid[e.target.dataset.x][e.target.dataset.y].innerText = turn;
            win = checkWin()
            if (win !== false) endGame(win)
            turn = turn == 'X' ? 'O' : 'X'
        }
    }
}

function showBtn() {
    resetBtn.classList.remove('hidden')
    resetBtn.classList.add('block')
}

function hideBtn() {
    resetBtn.classList.add('hidden')
    resetBtn.classList.remove('block')
}

function reset() {
    caption.innerText = ''
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            grid[i][j].innerText = ''
        }
    }
    turn = 'X'
    table.addEventListener('click', click)
    hideBtn()
}

function checkWin() {
    let tie = true;
    for (let i = 0; i < 3; i++) {
        if (grid[i][0].innerText != '') {
            if (grid[i].every(val => val.innerText == grid[i][0].innerText)) return grid[i][0].innerText
        }
        if (grid[0][i].innerText != '') {
            if (grid[0][i].innerText == grid[1][i].innerText && grid[1][i].innerText == grid[2][i].innerText) return grid[0][i].innerText
        }
        if (tie) {
            for (let j = 0; j < 3; j++) {
                if (grid[i][j].innerText == '') {
                    tie = false
                    break
                }
            }
        }
    }

    if (grid[0][0].innerText != '') {
        if (grid[0][0].innerText == grid[1][1].innerText && grid[1][1].innerText == grid[2][2].innerText) return grid[0][0].innerText
    }
    
    if (grid[0][2].innerText != '') {
        if (grid[0][2].innerText == grid[1][1].innerText && grid[1][1].innerText == grid[2][0].innerText) return grid[0][2].innerText
    }

    if (tie) return ''

    return false;
}
