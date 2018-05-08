import { fork } from "child_process";
import { join } from "path";
import { store } from "../utils/store";
import global from "../utils/global"
import { log } from "../utils/logging";

export const startDiscovery = (): void => {

    const discoveryWorkerPath = join(__dirname, "workers", "discovery.js");

    // Create child process
    const child = fork(discoveryWorkerPath);

    // Send child process some work
    log.info(`[DISCOVERY-WORKER-START]`);
    child.send("start-discovery");

    // Event handler
    child.on("message", (message: any) => {

        log.info(`[DISCOVERY-WORKER-MESSAGE]: message ${message}`);
        const browser = global.mainWindow.webContents;

        // Handle failure message
        const hasFailedMessage = /^unsupported$/i.test(message);
        if (hasFailedMessage) {
            log.info(`[DISCOVERY-WORKER]: uPnP support probe failed!`);
            store.set("upnp.support", false);
            browser.send("upnp-not-supported");
            browser.send("set-local-storage", "upnp.support", false);
            return child.kill();
        }

        // Handle progress update message
        const isAttemptMessage = /^\d$/i.test(message);
        if (isAttemptMessage) {
            const attempt = message;
            log.info(`[DISCOVERY-WORKER]: attempt ${attempt}`);
            browser.send("upnp-attempt-update", attempt);
            return;
        }

        const location = message;

        // Persist the location for future use
        log.info(`[DISCOVERY-WORKER]: uPnP support successful!`);
        store.set("upnp.support", true);
        store.set("upnp.location", location);
        browser.send("upnp-supported");
        browser.send("set-local-storage", "upnp.support", true);
        return child.kill();
    });
};
