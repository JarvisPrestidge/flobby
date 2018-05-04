import { IpcRenderer, ipcMain } from "electron";
import { log } from "../utils/logging";

/**
 * Required to patch the shitty electron type definitions
 *
 * @interface IpcRendererEvent
 */
interface IpcRendererEvent {
    sender: IpcRenderer;
}

/**
 * Generic event handler wrapped with logging
 *
 * @template T
 * @param {string} channel
 * @param {(event: IpcRendererEvent, arg: T) => Promise<void>} listener
 */
export const eventHandler = <T>(channel: string, listener: (event: IpcRendererEvent, arg: T) => Promise<void>) => {

    ipcMain.on(channel, async (event: IpcRendererEvent, arg: T) => {
        log.info(`[IPC-CHANNEL-START]: ${channel}`);

        arg ? log.info(`[IPC-INCOMING-ARGS]: ${arg}`) : log.info(`[IPC-INCOMING-ARGS]: none`);

        listener(event, arg);

        log.info(`[IPC-CHANNEL-END]: ${channel}`);
    });
};
