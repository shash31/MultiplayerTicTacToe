const table = document.querySelector('table')
const resetBtn = document.getElementById('reset')
const caption = document.createElement('caption')
let grid = []
let turn;

table.innerText = 'Waiting for connection...'

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

const backend = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '/backend';
console.log('backend link:', backend)
const socket = new WebSocket(backend)

socket.onopen = () => {
    console.log('Connected to server!')
    table.innerText = 'Waiting for Player 2...'
}

socket.onmessage = (event) => {
    console.log('Server says:', event.data);
    const res = JSON.parse(event.data)
    console.log(res)
    if (res.startGame) {
        makeTable()
        if (turn == 'X') table.addEventListener('click', click)
    }
    if (res.turn) {
        turn = res.turn;
        caption.innerText = `You are ${turn}`
        table.caption = caption
        return
    }

    if (res.oppMove) {
        grid[res.oppMove[0]][res.oppMove[1]].innerText = turn == 'X' ? 'O' : 'X'
        table.addEventListener('click', click)
    }

    if (res.win == 'X' || res.win == 'O' || res.win == '') {
        endGame(res.win)
    }
}

function endGame(win) {
    table.removeEventListener('click', click)
    if (win != '') {
        caption.innerText = `${win} won!!`
    } else {
        caption.innerText = `Tie!!`
    }
    if (win == turn) {
        caption.classList.add('win')
    } else if (win != '') {
        caption.classList.add('lose')
    }
    showBtn()
}

async function click(e) {
    if (e.target != table) {
        if (e.target.innerText == '') {
            e.target.innerText = turn
            console.log('sending move to backend')
            socket.send(JSON.stringify({ move: [e.target.dataset.x, e.target.dataset.y] }));
            table.removeEventListener('click', click)
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
    caption.className = ''
    caption.innerText = ''
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            grid[i][j].innerText = ''
        }
    }
    table.removeChild(winner)
    hideBtn()
}
