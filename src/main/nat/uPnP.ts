import { deletePort } from "./deletePort";
import { forwardPort } from "./forwardPort";
import { startDiscovery } from "./startDiscovery";
import { store } from "../utils/store";

/**
 * Responsible for handling NAT hole punching
 *
 * @class UPNP
 */
class UPNP {

    /**
     * Begin the discovery of supported uPnP routers
     *
     * @static
     */
    public static startDiscovery(): void {
        startDiscovery();
    }

    /**
     * Creates a port forward mapping
     *
     * @static
     * @param {number} port
     * @returns {boolean}
     */
    public static forwardPort(port: number): boolean {
        const location = store.get("upnp.location");
        return forwardPort(location, port);
    }

    /**
     * Deletes a port mapping
     *
     * @static
     * @param {number} port
     * @returns {boolean}
     */
    public static deletePort(port: number): boolean {
        const location = store.get("upnp.location");
        return deletePort(location, port);
    }
}

export default UPNP;
