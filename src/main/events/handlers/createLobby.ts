import global from "../../utils/global";
import SocketServer from "../../socketio/server";
import uPnP from "../../nat/uPnP";
import { eventHandler } from "../../utils/events";
import { generateLobbyCode, getPortFromLobbyCode } from "../../utils/cypto";
import { log } from "../../utils/logging";
import { sleep } from "../../utils/time";

/**
 * Responsible for handling the creation of a new lobby
 *
 * @returns {void}
 */
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
