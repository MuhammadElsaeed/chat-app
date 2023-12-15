import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});


io.on('connection', (socket) => {

    console.log('a user connected. id: ' + socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected. id: ' + socket.id);
    });
    socket.on('chat message', ({ username, message }) => {
        io.emit('chat message', { username, message });
    });
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);
    });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
