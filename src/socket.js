import { io } from "socket.io-client";

const socket = io("https://lite.fenixcoder.com/");

export default socket;