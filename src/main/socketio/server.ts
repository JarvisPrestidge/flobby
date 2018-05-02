import * as Koa from "koa";
const IO = require("koa-socket-2");
const enableDestroy = require('server-destroy');


interface ISocketContext {
    event: any,
    data: any,
    socket: any,
    acknowledge: any
};

class SocketServer {
    private app: Koa;
    private io: any;

    constructor(port: number) {
        // Create koa + socket.io instances
        this.app = new Koa();
        this.io = new IO();

        // Attach to koa app
        this.io.attach(this.app);

        // Init event handlers
        this.initEventHandlers();

        this.app.use(async (ctx) => {
            ctx.body = "Hello World";
        });

        // Start server
        this.app.listen(port, "0.0.0.0", () => console.log(`listening on port ${port}`));

        enableDestroy(this.app);
    }

    private initEventHandlers() {

        // Setup socket events here
        this.io.on("connection", (ctx: ISocketContext) => {
            ctx.socket.on("timesync", (data: any) => {
                console.log("message", data);
                ctx.socket.emit("timesync", {
                    id: data && "id" in data ? data.id : null,
                    result: Date.now()
                });
            });
        });
    }

    public getApp() {
        return this.app;
    }

    public closeApp() {
        (this.app as any).destroy();
    }
}

export default SocketServer;
