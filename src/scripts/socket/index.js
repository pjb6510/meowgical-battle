import socketIOClient from "socket.io-client";

const socket = socketIOClient(
  `http://localhost:${process.env.SERVER_PORT}`
);

const createGame = (playerId) => {
  socket.emit("createGame", playerId);
};

const removeGame = (playerId) => {
  socket.emit("removeGame", playerId);
};

export default {
  createGame,
  removeGame,
};
