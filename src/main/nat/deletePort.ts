import C from "../constants";
import { execSyncBinary } from "../utils/exec";
import { store } from "../utils/store";
import { log } from "../utils/logging";

/**
 * Responsible for forwarding a port
 *
 * @param {string} location
 * @param {number} port
 * @returns {boolean}
 */
export const deletePort = (location: string, port: number): boolean => {

    log.info(`[FORWARD-DELETE]: attempting to delete port ${port}`);

    const args = [
        `-location=${location}`,
        `-port=${port}`
    ];

    const result = execSyncBinary(C.GO_BINARIES, "deletePort", ...args);

    const isPortSuccessfullyRemoved = /Success/i.test(result);

    log.info(`[FORWARD-DELETE-RESULT]: ${isPortSuccessfullyRemoved}`);

    // Update list of actively mapped ports
    if (isPortSuccessfullyRemoved) {
        const ports: number[] = store.get("upnp.ports");
        if (ports) {
            const updatedPorts = ports.filter((p) => p !== port);
            store.set("upnp.ports", updatedPorts);
        } else {
            const errorMessage = "upnp.ports default value was not set";
            log.error(errorMessage);
            throw new Error(errorMessage);
        }
    }

    return isPortSuccessfullyRemoved;
};

