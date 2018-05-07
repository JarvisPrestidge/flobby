import global from "../../utils/global";
import { eventHandler } from "../../utils/events";

/**
 * Responsible for handling joining an existing lobby
 *
 * @returns {void}
 */
eventHandler<void>("player-ready", async () => {
    global.client.isReady();
});

/**
 * Responsible for handling joining an existing lobby
 *
 * @returns {void}
 */
eventHandler<void>("player-unready", async () => {
    global.client.isUnready();
});
