import { io } from "socket.io-client";

let socket = null;

const createSocket = (user) => {
    if (!socket) {
        socket = io('http://localhost:3000', {
            transports: ['websocket'],
            withCredentials: true,
            query: { userId: user._id }
        });
    }
    return socket;
};

const getSocket = () => socket;

const clearSocket = () => socket = null;

export { createSocket, getSocket, clearSocket };