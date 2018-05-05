import global from "../../utils/global";
import uPnP from "../../nat/uPnP";
import { app } from "electron";
import { eventHandler } from "../../utils/events";
import { store } from "../../utils/store";

/**
 * Responsible for cleaning up connections / mapping before exiting
 *
 * @returns {void}
 */
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
