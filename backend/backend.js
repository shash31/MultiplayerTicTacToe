const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
let grid;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/', (req, res) => {
    grid = req.body;

    res.status(200).json({
        message: 'Received grid!'
    })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
