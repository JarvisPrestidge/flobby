import C from "./constants";
import global from "./utils/global";
import SocketClient from "./socketio/client";
import SocketServer from "./socketio/server";
import uPnP from "./nat/uPnP";
import { app } from "electron";
import { execAsyncBinaryAsAdmin } from "./utils/exec";
import { generateLobbyCode, getIpFromLobbyCode, getPortFromLobbyCode } from "./utils/cypto";
import { log } from "./utils/logging";
import { sleep } from "./utils/time";
import { store } from "./utils/store";
import { eventHandler } from "./infrastructure/eventHandler";


eventHandler("create-lobby", async (event) => {

    const lobbyCode = await generateLobbyCode();

    log.info("lobbyCode: ", lobbyCode);

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
});

eventHandler<string>("join-lobby", async (event, lobbyCode) => {

    const ip = getIpFromLobbyCode(lobbyCode);
    const port = getPortFromLobbyCode(lobbyCode);

    const socketClient = new SocketClient(ip, port);

    global.client = socketClient;

    event.sender.send("join-lobby-response");
});

eventHandler("execute-play", async (event) => {

    await execAsyncBinaryAsAdmin(C.AHK_BINARIES, "blockUserInput");
    await execAsyncBinaryAsAdmin(C.AHK_BINARIES, "bringToForeground");
    await execAsyncBinaryAsAdmin(C.AHK_BINARIES, "hoverOnPlay");

    // TODO: pass into executePlay a time relative to the system clock to
    // fire the play action.

    await execAsyncBinaryAsAdmin(C.AHK_BINARIES, "executePlay");

    event.sender.send("execute-play-response");
});

eventHandler<string>("store-name", async (_, name) => {

    // Persistently store user name
    store.set("user.name", name);
});

eventHandler<string>("probe-upnp-support", async (event) => {

    const support = uPnP.hasSupport();

    event.sender.send("probe-upnp-support-response", support);
});

eventHandler<string>("exit-app", async () => {

    if (global.server) {
        global.server.destroy();
    }
    if (global.client) {
        global.client.destroy();
    }

    // Get actively mapped ports
    const ports: number[] = store.get("upnp.ports");
    // Remove all port mappings
    if (ports && ports.length) {
        ports.map(uPnP.deletePort);
    }
    // Quit the application
    app.quit();
});
