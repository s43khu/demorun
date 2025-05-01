// src/services/socketManager.js
import { io } from 'socket.io-client';

const URL = process.env.REACT_APP_BACKEND_URL;

const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
