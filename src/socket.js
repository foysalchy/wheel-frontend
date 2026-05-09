import { io } from "socket.io-client";

const socket = io("http://206.72.199.216:5000/");

export default socket;