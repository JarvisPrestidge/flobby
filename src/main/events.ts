import { ipcMain, IpcRenderer } from "electron";
import { getLobbyCode } from "./utils/cypto";

/**
 * Required to patch the shitty electron type definitions
 *
 * @interface IpcRendererEvent
 */
interface IpcRendererEvent {
    sender: IpcRenderer;
}

ipcMain.on("create-new-lobby", async (event: IpcRendererEvent, ...args: any[]) => {

    if (args) {
        console.log(args);
    }

    // Get public ip and open port
    const lobbyCode = await getLobbyCode();

    const response = {
        lobbyCode
    };

    event.sender.send("create-new-lobby-response", response);
});
