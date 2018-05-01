import { app, ipcMain, IpcRenderer } from "electron";
import { getLobbyCode, getPortFromLobbyCode, getIpFromLobbyCode } from "./utils/cypto";
import Store = require("electron-store");
import { execAsAdmin } from "./utils/ahk";
import SocketServer from "./socketio/server";
import SocketClient from "./socketio/client";
import PortController from "./nat/punch";



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

ipcMain.on("create-lobby", async (event: IpcRendererEvent) => {
    // Get public ip and open port
    const lobbyCode = await getLobbyCode();

    console.log(lobbyCode);

    const port = getPortFromLobbyCode(lobbyCode);

    const portController = new PortController();

    const setupResult = await portController.setup();
    console.log(setupResult);

    const mappingResult = await portController.addPortMapping(port, port, 3600);
    console.log(mappingResult);

    const activeResult = await portController.getActivePortMapping();
    console.log(activeResult);

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

    await execAsAdmin("blockUserInput");
    await execAsAdmin("bringToForeground");
    await execAsAdmin("hoverOnPlay");

    // TODO: pass into executePlay a time relative to the system clock to
    // fire the play action.

    await execAsAdmin("executePlay");

    event.sender.send("execute-play-response");
});

ipcMain.on("store-name", async (_: IpcRendererEvent, name: string) => {
    // Persistently store user name
    store.set("name", name);
});

ipcMain.on("exit-app", async () => {
    // Quit the application
    app.quit();
});
