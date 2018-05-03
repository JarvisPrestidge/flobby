import * as bunyan from "bunyan";
import { app } from "electron";
import { join } from "path";

const errorLogPath = join(app.getPath("appData"), "flobby-error.log")

const log = bunyan.createLogger({
    name: "flobby",
    streams: [
        {
            level: "info",
            stream: process.stdout
        },
        {
            level: "error",
            path: errorLogPath
        }
    ]
});

export { log };
