import { io } from "socket.io-client";

const socket = io("https://wheel-backend-omega.vercel.app/");

export default socket;