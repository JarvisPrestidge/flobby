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
export const forwardPort = (location: string, port: number): boolean => {

    log.info(`[FORWARD-PORT]: attempting to forward port ${port}`);
    const args = [`-location=${location}`, `-port=${port}`];

    const result = execSyncBinary(C.GO_BINARIES, "forwardPort", ...args);

    const isPortSuccessfullyMapped = /Success/i.test(result);

    log.info(`[FORWARD-PORT-RESULT]: ${isPortSuccessfullyMapped}`);

    // Update list of actively mapped ports
    if (isPortSuccessfullyMapped) {
        const ports: number[] = store.get("upnp.ports");
        if (ports) {
            ports.push(port);
            store.set("upnp.ports", ports);
        } else {
            const errorMessage = "upnp.ports default value was not set";
            log.error(errorMessage);
            throw new Error(errorMessage);
        }
    }

    return isPortSuccessfullyMapped;
};
