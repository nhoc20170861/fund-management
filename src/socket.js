import { io } from "socket.io-client";
import configs from "configs";
// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production"
    ? configs.DOMAIN_SERVER
    : "http://192.168.16.101:3000";

const socket = io(URL, {
  reconnectionDelayMax: 10000,
  autoConnect: false,
});
export default socket;
