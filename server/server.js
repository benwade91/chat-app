const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const port = process.env.PORT || 4001;
const routes = require("./routes");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
  }
});

const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
app.use(routes);
app.use(cors());

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit('message', { user: 'admin', text: `Welcome to the chat ${user.name}` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined the chat!` })
    socket.join(user.room);

    io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    // console.log(user);
    io.to(user.room).emit('message', { user: user.name, text: message });
    io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

    callback();
  })

  socket.on('deleteMessage', (message, callback) => {
    const user = getUser(socket.id);
    // console.log(message);
    io.to(user.room).emit('updateMessages', message);
    callback();
  })

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if(user){
      io.to(user.room).emit('message', {user:'admin', text:`${user.name} disconnected...`})
    }

    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));
