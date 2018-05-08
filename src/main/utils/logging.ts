import * as bunyan from "bunyan";
import { app } from "electron";
import { join } from "path";

const logPath = join(app.getPath("logs"), "logs.txt");

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
