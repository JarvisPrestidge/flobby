import { execSyncGoBinary } from "../utils/exec";

process.on("message", async (m: string) => {

    if (m !== "discoverLocation") {
        throw new Error("Unknown inter-process request recieved");
    }

    getLocation();
});

/**
 * Long running blocking attempt at retrieving uPnP supported router location
 */
const getLocation = (): void => {

    let location;
    const attempts = 0;
    while (!location) {
        location = execSyncGoBinary("discoverLocation");
        if (attempts > 10) {
            (process as any).send("Failed");
        }
    }

    // Remove whitespace
    location = location.trim();

    // Pass results back to parent process
    (process as any).send(location);
};
