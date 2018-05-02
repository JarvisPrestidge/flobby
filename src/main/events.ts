import SocketClient from "./socketio/client";
import SocketServer from "./socketio/server";
import { app, ipcMain, IpcRenderer } from "electron";
import { execAsAdminAHK } from "./utils/exec";
import { getIpFromLobbyCode, getLobbyCode, getPortFromLobbyCode } from "./utils/cypto";
import { sleep } from "./utils/time";
import Store = require("electron-store");
import uPnP from "./nat/uPnP";

/**
 * Required to patch the shitty electron type definitions
 *
 * @interface IpcRendererEvent
 */
interface IpcRendererEvent {
    sender: IpcRenderer;
}

// Create new instance of store
const store = new Store();
(global as any).store = store;

ipcMain.on("create-lobby", async (event: IpcRendererEvent) => {
    // Get public ip and open port
    const lobbyCode = await getLobbyCode();

    console.log(lobbyCode);

    const port = getPortFromLobbyCode(lobbyCode);

    let location;
    let unsupported;
    while (!location) {
        location = (global as any).store.get("location");
        unsupported = (global as any).store.get("unsupported");
        if (unsupported) {
            return event.sender.send("peer-to-peer-unsupported");
        }
        await sleep(200);
    }

    uPnP.forwardPort(port);

    const socketServer = new SocketServer(port);

    (global as any).server = socketServer.getApp();

    event.sender.send("create-lobby-response", { lobbyCode });
});

ipcMain.on("join-lobby", async (event: IpcRendererEvent, lobbyCode: string) => {

    console.log("fired Join-lobby from main", lobbyCode);

    const ip = getIpFromLobbyCode(lobbyCode);
    const port = getPortFromLobbyCode(lobbyCode);

    const socketClient = new SocketClient(ip, port);

    (global as any).client = socketClient;

    event.sender.send("join-lobby-response");
});

ipcMain.on("execute-play", async (event: IpcRendererEvent, lobbyCode: string) => {

    console.log("fired execute-play from main", lobbyCode);

    await execAsAdminAHK("blockUserInput");
    await execAsAdminAHK("bringToForeground");
    await execAsAdminAHK("hoverOnPlay");

    // TODO: pass into executePlay a time relative to the system clock to
    // fire the play action.

    await execAsAdminAHK("executePlay");

    event.sender.send("execute-play-response");
});

ipcMain.on("store-name", async (_: IpcRendererEvent, name: string) => {
    // Persistently store user name
    store.set("name", name);
});

ipcMain.on("exit-app", async () => {
    // Remove all port mappings
    const mappedPorts = (global as any).store.get("mappedPorts") as number[];
    for (const port of mappedPorts) {
        uPnP.deletePort(port);
    }
    // Quit the application
    app.quit();
});
