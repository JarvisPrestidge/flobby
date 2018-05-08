import * as publicIp from "public-ip";
import { log } from "./logging";
const openPort = require("openport");

/**
 * Returns an open port on the host
 *
 * @returns {Promise<number>}
 */
export const getOpenPort = async (): Promise<string> => {

    // Wrap the old-style callback in a promise
    return new Promise<string>((resolve, reject) => {

        openPort.find((err: Error, port: number) => {
            if (err) {
                reject(`No availble ports: ${err.message}`);
            }
            // Convert open port to string
            log.info(`[GET-OPEN-PORT]: found open port: ${port.toString()}`);
            const ret = port.toString();
            resolve(ret);
        });
    });
};

/**
 * Returns the public ip address of the host
 *
 * @returns {Promise<number>}
 */
export const getPublicIPAddress = async (): Promise<string> => {

    // Wrap the old-style callback in a promise
    return new Promise<string>((resolve) => {

        publicIp.v4().then(ip => {
            log.info(`[GET-PUBLIC-IP]: found public ip: ${ip}`);
            resolve(ip)
        });
    });
};
