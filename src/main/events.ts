import { ipcMain, IpcRenderer } from "electron";
import { getLobbyCode } from "./utils/cypto";
import Store = require("electron-store");

/**
 * Required to patch the shitty electron type definitions
 *
 * @interface IpcRendererEvent
 */
interface IpcRendererEvent {
    sender: IpcRenderer;
}

// Create new instance of store
const store = new Store();

ipcMain.on("create-lobby", async (event: IpcRendererEvent, ..._: any[]) => {

    // Get public ip and open port
    const lobbyCode = await getLobbyCode();

    event.sender.send("create-lobby-response", { lobbyCode });
});

ipcMain.on("store-name", async (_: IpcRendererEvent, name: string) => {

    // Persistently store user name
    store.set("name", name);
});
