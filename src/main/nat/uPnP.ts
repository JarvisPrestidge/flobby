import { fork } from "child_process";
import { join } from "path";
import { forwardPort } from "./forwardPort";
import { deletePort } from "./deletePort";

class NATuPnP {

    public static discover() {

        const childProcessPath = join(__dirname, "discoverLocation.js")

        const child = fork(childProcessPath);

        // Send child process some work
        child.send("discoverLocation");

        // Event handler
        child.on("message", (message: string) => {

            if (message === "Failed") {
                child.kill();
                return (global as any).store.set("unsupported", true);
            }

            const location = message;

            // Persist the location for future use
            (global as any).store.set("location", location);
        });
    }

    private static getLocation() {
        const location = (global as any).store.get("location");
        return location;
    }

    public static forwardPort(port: number) {
        const location = this.getLocation();

        if (location) {
            return forwardPort(location, port);
        }
    }

    public static deletePort(port: number) {
        const location = this.getLocation();

        if (location) {
            return deletePort(location, port);
        }
    }
}

export default NATuPnP;
