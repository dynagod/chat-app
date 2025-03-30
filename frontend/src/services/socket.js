import { io } from "socket.io-client";

let socket = null;

const createSocket = (user) => {
    if (!socket) {
        socket = io(process.env.REACT_APP_BACKEND_URL, {
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