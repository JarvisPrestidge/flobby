import { fork } from "child_process";
import { join } from "path";
import { store } from "../utils/store";
import { ipcMain } from "electron";

export const startDiscovery = (): void => {

    const discoveryWorkerPath = join(__dirname, "workers", "discovery.js");

    // Create child process
    const child = fork(discoveryWorkerPath);

    // Send child process some work
    child.send("start-discovery");

    // Event handler
    child.on("message", (message: any) => {

        // Handle failure message
        const hasFailedMessage = /^unsupported$/i.test(message);
        if (hasFailedMessage) {
            store.set("upnp.support", false);
            ipcMain.emit("upnp-unsupported");
            return child.kill();
        }

        // Handle progress update message
        const isAttemptMessage = /^\d$/i.test(message);
        if (isAttemptMessage) {
            const attempt = message;
            ipcMain.emit("upnp-attempt-update", attempt);
            return child.kill();
        }

        const location = message;

        // Persist the location for future use
        store.set("upnp.support", true);
        store.set("upnp.location", location);
        ipcMain.emit("upnp-supported");
    });
};
