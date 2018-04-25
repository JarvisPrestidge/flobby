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

export const btoa = (input: string) => Buffer.from(input).toString("base64");

export const atob = (input: string) => Buffer.from(input, "base64").toString();
