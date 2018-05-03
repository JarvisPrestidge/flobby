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
export const deletePort = (location: string, port: number): boolean => {

    const args = [
        `-location=${location}`,
        `-port=${port}`
    ];

    const result = execSyncBinary(C.GO_BINARIES, "deletePort", ...args);

    const isPortSuccessfullyRemoved = /Success/i.test(result);

    // Update list of actively mapped ports
    if (isPortSuccessfullyRemoved) {
        const ports: number[] = store.get("upnp.ports");
        if (ports) {
            const updatedPorts = ports.filter((p) => p !== port);
            store.set("upnp.ports", updatedPorts);
        }
    }

    return isPortSuccessfullyRemoved;
};

