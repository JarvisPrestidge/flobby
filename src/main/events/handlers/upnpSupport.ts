import uPnP from "../../nat/uPnP";
import { eventHandler } from "../../utils/events";

/**
 * Responsible for handling the uPnP support
 *
 * @returns {void}
 */
eventHandler<string>("probe-upnp-support", async (event) => {

    const support = uPnP.hasSupport();

    event.sender.send("probe-upnp-support-response", support);
});
