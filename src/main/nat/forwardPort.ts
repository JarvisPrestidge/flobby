import { execSyncGoBinary } from "../utils/exec";

/**
 * Responsible for forwarding a port
 *
 * @param {string} location
 * @param {number} port
 * @returns {boolean}
 */
export const forwardPort = (location: string, port: number): boolean => {

    const args = [`-location=${location}`, `-port=${port}`];

    const result = execSyncGoBinary("forwardPort", ...args);

    const isPortSuccessfullyMapped = /Success/i.test(result);

    // Update list of actively mapped ports
    let mappedPorts = (global as any).store.get("mappedPorts") as number[];
    if (mappedPorts) {
        mappedPorts.push(port);
    } else {
        mappedPorts = [port];
    }

    // Persist the port mapping
    (global as any).store.set("mappedPorts", mappedPorts);

    return isPortSuccessfullyMapped;
};
