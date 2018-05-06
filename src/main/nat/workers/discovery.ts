import C from "../../constants";
import { execSyncBinary } from "../../utils/exec";

process.on("message", async (message: string) => {

    if (message !== "start-discovery") {
        throw new Error("Unknown inter-process request recieved");
    }

    await getSupportedRouterLocation();
});

/**
 * Long running blocking attempt at retrieving uPnP supported router location
 */
const getSupportedRouterLocation = async (): Promise<void> => {

    let location;
    let attempt = 0;

    while (!location) {

        // Send progress update to parent
        attempt++;
        if (process.send) {
            process.send(attempt);
        }

        // Start a discovery cycle
        location = execSyncBinary(C.GO_BINARIES, "discoverLocation");

        // Fail permanently after 10 attempts
        if (attempt > 10) {
            if (process.send) {
                process.send("unsupported");
            }
        }
    }

    // Remove whitespace
    location = location.trim();

    // Pass results back to parent process
    if (process.send) {
        process.send(location);
    }
};
