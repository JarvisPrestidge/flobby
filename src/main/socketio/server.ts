import * as Koa from "koa";
import { IClientInfo } from "../interfaces/IClientInfo";
import { log } from "../utils/logging";
import { Server } from "http";

const IO = require("koa-socket-2");
const enableDestroy = require("server-destroy");

interface ISocketContext {
    event: any;
    data: any;
    socket: any;
    acknowledge: any;
}

/**
 * Single instance of a socket.io server
 *
 * @class SocketServer
 */
class SocketServer {

    private io: any;
    private server: Server;
    private state: IClientInfo[] = [];

    constructor(port: number) {
        // Create socket server instance
        this.server = this.initServer(port);
        // Enable graceful destroy
        enableDestroy(this.server);
        // Initialize handlers
        this.initEventHandlers();
    }

    private initServer(port: number): Server {
        log.info(`[SOCKET-SERVER]: initServer() - on port ${port}`);
        const app = new Koa();
        this.io = new IO();
        this.io.attach(app);

        // TODO: remove
        app.use(async (ctx) => {
            ctx.body = "Hello World";
        });

        // Start server
        return app.listen(port);
    }

    private initEventHandlers() {

        // Setup socket events here
        this.io.on("connection", (ctx: ISocketContext) => {

            ctx.socket.on("client-connect", (clientInfo: IClientInfo) => {
                log.info(`[ON-SERVER-SOCKET-EVENT]: client-connect`, clientInfo);
                this.state.push(clientInfo);
                this.io.broadcast("client-state-change", this.state);
            });

            ctx.socket.on("client-ready", (clientInfo: IClientInfo) => {
                log.info(`[ON-SERVER-SOCKET-EVENT]: client-ready`, clientInfo);
                this.state = this.state.map((c) => {
                    if (c.id === clientInfo.id) {
                        c.ready = true;
                    }
                    return c;
                });
                this.io.broadcast("client-state-change", this.state);
                const isLobbyReady = this.isLobbyReady();
                if (isLobbyReady) {
                    this.startTimeSync();
                }
            });

            ctx.socket.on("client-unready", (clientInfo: IClientInfo) => {
                log.info(`[ON-SERVER-SOCKET-EVENT]: client-unready`, clientInfo);
                this.state = this.state.map((c) => {
                    if (c.id === clientInfo.id) {
                        c.ready = false;
                    }
                    return c;
                });
                this.io.broadcast("client-state-change", this.state);
            });

            ctx.socket.on("client-disconnect", (clientInfo: IClientInfo) => {
                log.info(`[ON-SERVER-SOCKET-EVENT]: client-disconnect`, clientInfo);
                this.state = this.state.filter((c) => c.id !== clientInfo.id);
                this.io.broadcast("client-state-change", this.state);
            });

            ctx.socket.on("timesync", (data: any) => {
                log.info(`[ON-SERVER-SOCKET-EVENT]: time-sync`, data);
                ctx.socket.emit("timesync", {
                    id: data && "id" in data ? data.id : null,
                    result: Date.now()
                });
            });
        });
    }

    startTimeSync() {
        log.info(`[SERVER-FUNC]: startTimeSync`);
        this.io.broadcast("start-time-sync");
        setTimeout(() => this.stopTimeSync(), 10000);
    }

    stopTimeSync() {
        log.info(`[SERVER-FUNC]: stopTimeSync`);
        const nowEpoch = Date.now();
        const triggerEpoch = nowEpoch + 5000;
        this.io.broadcast("stop-time-sync", triggerEpoch);
    }

    isLobbyReady(): boolean {
        return this.state.every((c) => c.ready);
    }

    public destroy() {
        this.server.destroy();
    }
}

export default SocketServer;
