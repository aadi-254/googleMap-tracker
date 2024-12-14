const express = require('express');
const http = require('http');
const socket = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socket(server);

// Set the view engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io connection handling
io.on('connection', function (socket) {
    socket.on("send-location", (data)=>{
        socket.broadcast.emit("receive-location",{id:socket.id,...data})
    })
    socket.on('disconnect',  ()=> {
        io.emit("user-disc",socket.id);
    });
});

// Basic route
app.get('/',  (req, res)=> {
    res.render('index'); // Render the EJS template "views/index.ejs"
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});