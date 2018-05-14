import SocketClient from "../socketio/client";
import SocketServer from "../socketio/server";
import { BrowserWindow } from "electron";

/**
 * Extend the NodeJS Global interface
 *
 * @interface IGlobal
 * @extends {NodeJS.Global}
 */
interface IGlobal extends NodeJS.Global {
    appPath: string;
    mainWindow: BrowserWindow,
    client: SocketClient,
    server: SocketServer,
}

export default global as IGlobal;




