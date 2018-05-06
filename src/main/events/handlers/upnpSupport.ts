import { eventHandler } from "../../utils/events";
import { store } from "../../utils/store";

/**
 * Responsible for handling the uPnP support
 *
 * @returns {void}
 */
eventHandler<boolean>("get-upnp-support-sync", async (event) => {

    const support = !!store.get("upnp.support");

    event.returnValue = support;
});

/**
 * Responsible for handling the uPnP support
 *
 * @returns {void}
 */
eventHandler<boolean>("get-upnp-support-async", async (event) => {

    const support = !!store.get("upnp.support");

    event.sender.send("get-upnp-support-response", support);
});
