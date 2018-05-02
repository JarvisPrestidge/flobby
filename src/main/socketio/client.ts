import * as IO from "socket.io-client";
const timesync = require("timesync");

class SocketClient {

    private io: any;
    private ts: any;

    constructor(ip: string, port: number) {
        // Create koa + socket.io instances
        console.log(ip);
        const uri = `http://${ip}:${port}`;
        this.io = IO.connect(uri, { reconnection: true });
        console.log("connecting to " + uri);

        this.ts = timesync.create({
            server: this.io,
            interval: 5000
        });

        // Init event handlers
        this.initEventHandlers();
    }

    private initEventHandlers() {

        this.ts.on("sync", (state: any) => {
            console.log("sync " + state + "");
        });

        this.ts.on("change", (offset: any) => {
            console.log("changed offset: " + offset + " ms");
        });

        this.ts.send = (socket: any, data: any, timeout: number) => {
            console.log("send", data);
            return new Promise((resolve, reject) => {
                const timeoutFn = setTimeout(reject, timeout);
                socket.emit("timesync", data, () => {
                    clearTimeout(timeoutFn);
                    resolve();
                });
            });
        };

        this.io.on("timesync", (data: any) => {
            // console.log('receive', data);
            this.ts.receive(null, data);
        });
    }

    public getTime(): number {
        return this.ts.now();
    }

    public destroy(): void {
        this.ts.destroy();
    }
}

export default SocketClient;

