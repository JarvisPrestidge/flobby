import * as Koa from "koa";
const IO = require("koa-socket-2");

class SocketServer {

    private app: Koa;
    private io: any;

    constructor(port: number) {

        // Create koa + socket.io instances
        this.app = new Koa();
        this.io = new IO();

        // Attach to koa app
        this.io.attach(this.app);

        this.initEventHandlers();

        // Start the server
        this.app.listen(port, () => console.log(`listening on port ${port}`));
    }

    private initEventHandlers() {

        // Setup socket events here

        this.io.on("message", (ctx: any, data: any) => {
            console.log("client sent data to message endpoint", data, ctx);
        });
    }

    public getApp() {
        return this.app;
    }
}

export default SocketServer;
