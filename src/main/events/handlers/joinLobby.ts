import global from "../../utils/global";
import SocketClient from "../../socketio/client";
import { eventHandler } from "../../utils/events";
import { getIpFromLobbyCode, getPortFromLobbyCode } from "../../utils/cypto";

/**
 * Responsible for handling joining an existing lobby
 *
 * @returns {void}
 */
eventHandler<string>("join-lobby", async (_, lobbyCode, isLocal) => {

    let ip: string;
    if (isLocal) {
        ip = "localhost";
    } else {
        ip = getIpFromLobbyCode(lobbyCode);
    }

    const port = getPortFromLobbyCode(lobbyCode);

    const socketClient = new SocketClient(ip, port);

    global.client = socketClient;
});
