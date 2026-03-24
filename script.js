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

function sendGridToBackend() {
    console.log(JSON.stringify(grid))
    fetch('https://test.shash.digital/backend/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(grid) 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data); 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function click(e) {
    if (e.target != table) {
        if (e.target.innerText == '') {
            e.target.innerText = turn
            grid[e.target.dataset.x][e.target.dataset.y] = turn
            console.log('sending grid to backend')
            sendGridToBackend()
            const win = checkWin()
            if (win != '') {
                table.removeEventListener('click', click)
                winner.innerText = `${win} won!!`
                table.appendChild(winner)
                showBtn()
            }
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
}


function checkWin() {
    for (let i = 0; i < 3; i++) {
        if (grid[i][0] != '') {
            if (grid[i].every(val => val == grid[i][0])) return grid[i][0]
        }
        if (grid[0][i] != '') {
            if (grid[0][i] == grid[1][i] && grid[1][i] == grid[2][i]) return grid[0][i]
        }
    }

    if (grid[0][0] != '') {
        if (grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2]) return grid[0][0]
    }
    
    if (grid[0][2] != '') {
        if (grid[0][2] == grid[1][1] && grid[1][1] == grid[2][0]) return grid[0][2]
    }

    return '';
}
