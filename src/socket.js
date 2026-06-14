import { io } from "socket.io-client";

const socket = io("https://api.luckynumber.fun/");

export default socket;