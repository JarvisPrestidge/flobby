import { ipcMain, IpcRenderer } from "electron";

/**
 * Required to patch the shitty electron type definitions
 *
 * @interface IpcRendererEvent
 */
interface IpcRendererEvent {
    sender: IpcRenderer;
}

ipcMain.on("testerino", (event: IpcRendererEvent, ...args: any[]) => {
    if (args) {
        console.log(args);
    }
    // Construct response object
    const response = {
        message: "wasssup homie"
    };
    event.sender.send("testerino-repsonse", response);
});
