import { io } from "socket.io-client";

const socket = io("https://api.fenixcoder.com/");

export default socket;