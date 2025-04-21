import { io } from 'socket.io-client';

const socket = io('http://localhost:5001'); // Adjust if hosted

export default socket;
