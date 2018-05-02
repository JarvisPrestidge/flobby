import { execSyncGoBinary } from "../utils/exec";

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

    const result = execSyncGoBinary("deletePort", ...args);

    const isPortSuccessfullyRemoved = /Success/i.test(result);

    // Update list of actively mapped ports
    const mappedPorts = (global as any).store.get("mappedPorts") as number[];
    if (mappedPorts) {
        const index = mappedPorts.indexOf(port);
        mappedPorts.splice(index, 1);
        (global as any).store.set("mappedPorts", mappedPorts);
    }

    return isPortSuccessfullyRemoved;
};

