import C from "../../constants";
import { execSyncBinary } from "../../utils/exec";

process.on("message", async (message: string) => {

    if (message !== "start-discovery") {
        throw new Error("Unknown inter-process request recieved");
    }

    getSupportedRouterLocation();
});

/**
 * Long running blocking attempt at retrieving uPnP supported router location
 */
const getSupportedRouterLocation = (): void => {

    let location;
    const attempts = 0;
    while (!location) {
        location = execSyncBinary(C.GO_BINARIES, "discoverLocation");
        if (attempts > 10) {
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
