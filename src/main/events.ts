import C from "./constants";
import global from "./utils/global";
import SocketClient from "./socketio/client";
import SocketServer from "./socketio/server";
import uPnP from "./nat/uPnP";
import { app, ipcMain, IpcRenderer } from "electron";
import { execAsyncBinaryAsAdmin } from "./utils/exec";
import { generateLobbyCode, getIpFromLobbyCode, getPortFromLobbyCode } from "./utils/cypto";
import { log } from "./utils/logging";
import { sleep } from "./utils/time";
import { store } from "./utils/store";

/**
 * Required to patch the shitty electron type definitions
 *
 * @interface IpcRendererEvent
 */
interface IpcRendererEvent {
    sender: IpcRenderer;
}


ipcMain.on("create-lobby", async (event: IpcRendererEvent) => {

    log.info("[ON-EVENT]: create-lobby");

    const lobbyCode = await generateLobbyCode();

    log.info(lobbyCode, "lobbyCode");

    const port = getPortFromLobbyCode(lobbyCode);

    while (!uPnP.isReady()) {
        const support = uPnP.hasSupport();
        if (support === false) {
            return event.sender.send("peer-to-peer-unsupported");
        }
        await sleep(200);
    }

    const isSuccess = uPnP.forwardPort(port);
    if (!isSuccess) {
        // TODO: Send IPC to renderer
        throw new Error("Cannot issue port forwarding");
    }

    const socketServer = new SocketServer(port);

    global.server = socketServer;

    event.sender.send("create-lobby-response", { lobbyCode });

    log.info("[FIRED-EVENT]: create-lobby-response");
});

ipcMain.on("join-lobby", async (event: IpcRendererEvent, lobbyCode: string) => {

    log.info("[ON-EVENT]: join-lobby");
    log.info(lobbyCode, "lobbyCode");

    const ip = getIpFromLobbyCode(lobbyCode);
    const port = getPortFromLobbyCode(lobbyCode);

    const socketClient = new SocketClient(ip, port);

    global.client = socketClient;

    event.sender.send("join-lobby-response");

    log.info("[FIRED-EVENT]: join-lobby-response");
});

ipcMain.on("execute-play", async (event: IpcRendererEvent, lobbyCode: string) => {

    log.info("[ON-EVENT]: execute-play");
    log.info(lobbyCode, "lobbyCode");

    await execAsyncBinaryAsAdmin(C.AHK_BINARIES, "blockUserInput");
    await execAsyncBinaryAsAdmin(C.AHK_BINARIES, "bringToForeground");
    await execAsyncBinaryAsAdmin(C.AHK_BINARIES, "hoverOnPlay");

    // TODO: pass into executePlay a time relative to the system clock to
    // fire the play action.

    await execAsyncBinaryAsAdmin(C.AHK_BINARIES, "executePlay");

    event.sender.send("execute-play-response");

    log.info("[FIRED-EVENT]: execute-play-response");
});

ipcMain.on("store-name", async (_: IpcRendererEvent, name: string) => {

    log.info("[ON-EVENT]: store-name");

    // Persistently store user name
    store.set("user.name", name);
});

ipcMain.on("exit-app", async () => {

    log.info("[ON-EVENT]: exit-app");

    // Get actively mapped ports
    const mappedPorts: number[] = store.get("upnp.ports");
    // Remove all port mappings
    mappedPorts.map(uPnP.deletePort);
    // Quit the application
    app.quit();
});
