const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 3000;
const bodyParser = require('body-parser');
const path = require('path');

io.on('connection', socket => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('occupancy', occupancy => {
        console.log(occupancy);
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/demo', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/demo.html'));
});

app.get('/occupancy', async (req, res)=>{
    const {camera, count} = req.body;
    io.emit('occupancy', {camera, count});
    res.send('ok');
})

io.on('occupancy', occupancy => {
    console.log(occupancy);
});


server.listen(port, function () {
    console.log('Listening on port ' + port);
});
