import { fork } from "child_process";
import { join } from "path";
import { store } from "../utils/store";
import global from "../utils/global"

export const startDiscovery = (): void => {

    const discoveryWorkerPath = join(__dirname, "workers", "discovery.js");

    // Create child process
    const child = fork(discoveryWorkerPath);

    // Send child process some work
    child.send("start-discovery");

    // Event handler
    child.on("message", (message: any) => {

        const rendererWebContents = global.mainWindow.webContents;

        // Handle failure message
        const hasFailedMessage = /^unsupported$/i.test(message);
        if (hasFailedMessage) {
            store.set("upnp.support", false);
            rendererWebContents.send("upnp-not-supported");
            rendererWebContents.send("set-local-storage", "upnp.support", false);
            return child.kill();
        }

        // Handle progress update message
        const isAttemptMessage = /^\d$/i.test(message);
        if (isAttemptMessage) {
            const attempt = message;
            rendererWebContents.send("upnp-attempt-update", attempt);
            return;
        }

        const location = message;

        // Persist the location for future use
        store.set("upnp.support", true);
        store.set("upnp.location", location);
        rendererWebContents.send("upnp-supported");
        rendererWebContents.send("set-local-storage", "upnp.support", true);
    });
};
