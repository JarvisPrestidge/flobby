import * as bunyan from "bunyan";


const log = bunyan.createLogger({
    name: "flobby",
    streams: [
        {
            level: "info",
            stream: process.stdout
        }
    ]
});

export { log };
