import * as bunyan from "bunyan";
import { homedir } from "os";
import { join } from "path";

const logPath = join(homedir(), "AppData", "Roaming", "flobby", "logs", "log.txt");

const log = bunyan.createLogger({
    name: "flobby",
    streams: [
        {
            level: "info",
            stream: process.stdout
        },
        {
            level: "info",
            path: logPath
        }
    ]
});

export { log };
