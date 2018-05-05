import global from "../../utils/global";
import SocketClient from "../../socketio/client";
import { eventHandler } from "../../utils/events";
import { getIpFromLobbyCode, getPortFromLobbyCode } from "../../utils/cypto";

/**
 * Responsible for handling joining an existing lobby
 *
 * @returns {void}
 */
eventHandler<string>("join-lobby", async (event, lobbyCode) => {

    const ip = getIpFromLobbyCode(lobbyCode);
    const port = getPortFromLobbyCode(lobbyCode);

    const socketClient = new SocketClient(ip, port);

    global.client = socketClient;

    event.sender.send("join-lobby-response");
});
