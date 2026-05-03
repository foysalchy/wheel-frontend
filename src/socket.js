import { io } from "socket.io-client";

const socket = io("https://wheel-backend-red.vercel.app");

export default socket;