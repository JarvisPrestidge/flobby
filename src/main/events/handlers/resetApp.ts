import global from "../../utils/global";
import uPnP from "../../nat/uPnP";
import { eventHandler } from "../../utils/events";
import { store } from "../../utils/store";

/**
 * Responsible for cleaning up connections / mapping
 *
 * @returns {void}
 */
eventHandler<void>("reset-app", async () => {

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
});
