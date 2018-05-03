import C from "../constants";
import { execSyncBinary } from "../utils/exec";
import { store } from "../utils/store";

/**
 * Responsible for forwarding a port
 *
 * @param {string} location
 * @param {number} port
 * @returns {boolean}
 */
export const forwardPort = (location: string, port: number): boolean => {

    const args = [`-location=${location}`, `-port=${port}`];

    const result = execSyncBinary(C.GO_BINARIES, "forwardPort", ...args);

    const isPortSuccessfullyMapped = /Success/i.test(result);

    // Update list of actively mapped ports
    if (isPortSuccessfullyMapped) {
        const ports: number[] = store.get("upnp.ports");
        if (ports) {
            const updatedPorts = ports.push(port);
            store.set("upnp.ports", updatedPorts);
        } else {
            const updatedPorts = [port];
            store.set("upnp.ports", updatedPorts);
        }
    }

    return isPortSuccessfullyMapped;
};
