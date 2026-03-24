const table = document.querySelector('table')
const resetBtn = document.getElementById('reset')
const winner = document.createElement('caption')
let grid = [['', '', ''], ['', '', ''], ['', '', '']]
let turn = 'X'

for (let i = 0; i < 3; i++) {
    const row = document.createElement('tr')
    for (let j = 0; j < 3; j++) {
        const cell = document.createElement('td')
        cell.dataset.x = i; cell.dataset.y = j
        row.appendChild(cell)
    }
    table.appendChild(row)
}

table.addEventListener('click', click)

// const socket = new WebSocket('ws://localhost:8080')
const socket = new WebSocket('http://tictactoe.shash.digital/backend')

socket.onopen = () => console.log('Connected to server!');
socket.onmessage = (event) => {
    console.log('Server says:', event.data);
    const res = JSON.parse(event.data)
    console.log(res)
    grid = res.grid
    const rows = table.rows
    for (let i = 0; i < 3; i++) {
        const cells = rows[i].cells
        for (let j = 0; j < 3; j++) {
            cells[j].innerText = grid[i][j]
        }
    }
    if (res.win !== false) {
        endGame(res.win)
    }
}

function endGame(win) {
    table.removeEventListener('click', click)
    if (win != '') {
        winner.innerText = `${win} won!!`
    } else {
        winner.innerText = `Tie!!`
    }
    table.appendChild(winner)
    showBtn()
}

async function click(e) {
    if (e.target != table) {
        if (e.target.innerText == '') {
            e.target.innerText = turn
            grid[e.target.dataset.x][e.target.dataset.y] = turn
            console.log('sending grid to backend')
            socket.send(JSON.stringify(grid));
            turn = turn == 'X' ? 'O' : 'X'
        }
    }
}

resetBtn.addEventListener('click', reset)

function showBtn() {
    resetBtn.classList.remove('hidden')
    resetBtn.classList.add('block')
}

function hideBtn() {
    resetBtn.classList.add('hidden')
    resetBtn.classList.remove('block')
}

function reset() {
    grid = [['', '', ''], ['', '', ''], ['', '', '']]
    const rows = table.rows;
    for (let i = 0; i < 3; i++) {
        const cells = rows[i].cells
        for (let j = 0; j < 3; j++) {
            cells[j].innerText = ''
        }
    }
    table.removeChild(winner)
    hideBtn()
    table.addEventListener('click', click)
}
