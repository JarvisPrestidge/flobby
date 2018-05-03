import { fork } from "child_process";
import { join } from "path";
import { store } from "../utils/store";

export const startDiscovery = (): void => {

    const discoveryWorkerPath = join(__dirname, "workers", "discovery.js");

    // Create child process
    const child = fork(discoveryWorkerPath);

    // Send child process some work
    child.send("start-discovery");

    // Event handler
    child.on("message", (message: string) => {

        // Handle failure
        if (message === "unsupported") {
            store.set("upnp.support", false);
            return child.kill();
        }

        const location = message;

        // Persist the location for future use
        store.set("upnp.support", true);
        store.set("upnp.location", location);
    });
};
