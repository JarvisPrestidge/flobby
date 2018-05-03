import SocketClient from "../socketio/client";
import SocketServer from "../socketio/server";

/**
 * Extend the NodeJS Global interface
 *
 * @interface IGlobal
 * @extends {NodeJS.Global}
 */
interface IGlobal extends NodeJS.Global {
    client: SocketClient,
    server: SocketServer,
}

export default global as IGlobal;




