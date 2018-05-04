import SocketClient from "../socketio/client";
import SocketServer from "../socketio/server";
import { App } from "electron";

/**
 * Extend the NodeJS Global interface
 *
 * @interface IGlobal
 * @extends {NodeJS.Global}
 */
interface IGlobal extends NodeJS.Global {
    app: App
    client: SocketClient,
    server: SocketServer,
}

export default global as IGlobal;




