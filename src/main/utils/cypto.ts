import { getOpenPort, getPublicIPAddress } from "./network";

/**
 * Responsible for creating a unique lobby code
 *
 * @returns {Promise<string>}
 */
export const getLobbyCode = async (): Promise<string> => {

    const port = await getOpenPort();
    const ip = await getPublicIPAddress();

    const preHash = `${ip}/${port}`;

    const lobbyCode = btoa(preHash);

    return lobbyCode;
};

/**
 * Fetches an ip address from a lobby code
 *
 * @param {string} lobbyCode
 * @returns {string}
 */
export const getIpFromLobbyCode = (lobbyCode: string): string => {

    const preHash = atob(lobbyCode);

    const match = preHash.match(/^(.*)\//i)

    let ip;
    if (match) {
        ip = match[1];
    } else {
        throw new Error("Could not retrieve ip address from lobby code");
    }

    return ip;
};

/**
 * Fetches a port number from a lobby code
 *
 * @param {string} lobbyCode
 * @returns {number}
 */
export const getPortFromLobbyCode = (lobbyCode: string): number => {

    const preHash = atob(lobbyCode);

    const match = preHash.match(/^.*\/(\d+)$/i)

    let port;
    if (match) {
        port = match[1];
    } else {
        throw new Error("Could not retrieve port from lobby code");
    }

    return parseInt(port, 10);
};

export const btoa = (input: string) => Buffer.from(input).toString("base64");

export const atob = (input: string) => Buffer.from(input, "base64").toString();
