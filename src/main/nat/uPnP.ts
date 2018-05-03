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
     * Return the upnp router location
     *
     * @private
     * @static
     * @returns {string}
     */
    private static getLocation(): string {
        return store.get("upnp.location");
    }

    /**
     * Return the current state of readiness
     *
     * @static
     * @returns {boolean}
     */
    public static isReady(): boolean {
        return !!store.get("upnp.support");
    }

    /**
     * Return the current state of readiness
     *
     * @static
     * @returns {boolean | undefined}
     */
    public static hasSupport(): boolean | undefined {
        return store.get("upnp.support");
    }

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
        return forwardPort(this.getLocation(), port);
    }

    /**
     * Deletes a port mapping
     *
     * @static
     * @param {number} port
     * @returns {boolean}
     */
    public static deletePort(port: number): boolean {
        return deletePort(this.getLocation(), port);
    }
}

export default UPNP;
