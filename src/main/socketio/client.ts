import * as io from "socket.io-client";
import global from "../utils/global";
import { IClientInfo } from "../interfaces/IClientInfo";
import { log } from "../utils/logging";
import { store } from "../utils/store";
import { v4 as uuid } from "uuid";
import { WebContents } from "electron";
import { startGamePrerequisites, startGame } from "../events/handlers/startGame";

const timesync = require("timesync");

class SocketClient {
    private io: any;
    private ts: any;
    private clientInfo: IClientInfo;
    private browser: WebContents;

    constructor(ip: string, port: number) {
        // Create unique info for client
        this.clientInfo = this.initClientInfo();
        // Create socket.io-client instance
        this.io = this.initClient(ip, port);
        // Initialize handlers
        this.initEventHandlers();
        // Get reference to browser window
        this.browser = global.mainWindow.webContents;
    }

    private initClient(ip: string, port: number) {
        log.info(`[SOCKET-CLIENT]: initClient() - connecting to ${ip}:${port}`);
        const uri = `http://${ip}:${port}`;
        return io.connect(uri, { reconnection: true });
    }

    private initClientInfo(): IClientInfo {
        const name = store.get("user.name");
        // Initialize client info
        const clientInfo: IClientInfo = {
            id: uuid(),
            name,
            ready: false,
            synced: false
        };
        return clientInfo;
    }

    private initEventHandlers() {
        this.onConnectHandler();
        this.onClientStateChangeHandler();
        this.onStartTimeSyncHandler();
        this.onStopTimeSyncHandler();
    }

    private onConnectHandler() {
        this.io.on("connect", () => {
            log.info(`[ON-CLIENT-SOCKET-EVENT]: client-connect`, this.clientInfo);
            this.io.emit("client-connect", this.clientInfo);
        });
    }

    private onClientStateChangeHandler() {
        this.io.on("client-state-change", (state: IClientInfo[]) => {
            log.info(`[ON-CLIENT-SOCKET-EVENT]: client-state-change`, state);
            this.browser.send("client-state-change", state);
        });
    }

    private onStartTimeSyncHandler() {
        this.io.on("start-time-sync", () => {
            log.info(`[ON-CLIENT-SOCKET-EVENT]: start-time-sync`);
            this.browser.send("lobby-is-ready");
            this.startTimeSync();
        });
    }

    private onStopTimeSyncHandler() {
        this.io.on("stop-time-sync", async (triggerEpoch: number) => {
            log.info(`[ON-CLIENT-SOCKET-EVENT]: stop-time-sync`);
            // Get the synced time
            const nowEpoch = this.getTime();
            // Diff the times
            const timeTilTrigger = triggerEpoch - nowEpoch;
            setTimeout(async () => startGame(), timeTilTrigger);
            // Destroy the time sync service
            this.ts.destroy();
            this.browser.send("game-starting");
            await startGamePrerequisites();
        });
    }

    private isDisconnected() {
        log.info(`[ON-CLIENT-SOCKET-EVENT]: client-disconnect`, this.clientInfo);
        this.io.emit("client-disconnect", this.clientInfo);
    }

    public isReady() {
        log.info(`[ON-CLIENT-SOCKET-EVENT]: client-ready`, this.clientInfo);
        this.clientInfo.ready = true;
        this.io.emit("client-ready", this.clientInfo);
    }

    public isUnready() {
        log.info(`[ON-CLIENT-SOCKET-EVENT]: client-unready`, this.clientInfo);
        this.clientInfo.ready = false;
        this.io.emit("client-unready", this.clientInfo);
    }

    public startTimeSync() {
        this.ts = timesync.create({
            server: this.io,
            interval: 5000
        });

        this.ts.on("sync", (state: any) => {
            log.info(`[ON-TIMESYNC-EVENT]: sync`, state);
        });

        this.ts.on("change", (offset: any) => {
            log.info(`[ON-TIMESYNC-EVENT]: change - offset:`, offset);
            this.browser.send("time-sync-offset-update", offset);
        });

        this.ts.send = (socket: any, data: any, timeout: number) => {
            log.info(`[ON-TIMESYNC-EVENT]: send`, data);
            return new Promise((resolve, reject) => {
                const timeoutFn = setTimeout(reject, timeout);
                socket.emit("timesync", data, () => {
                    clearTimeout(timeoutFn);
                    resolve();
                });
            });
        };

        this.io.on("timesync", (data: any) => {
            log.info(`[ON-TIMESYNC-EVENT]: timesync`, data);
            this.browser.send("time-sync-update", data.result);
            this.ts.receive(null, data);
        });
    }

    public getTime(): number {
        return this.ts.now();
    }

    public destroy(): void {
        this.isDisconnected();
        this.io.destroy();
        this.ts.destroy();
    }
}

export default SocketClient;

