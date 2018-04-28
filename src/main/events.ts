import { app, ipcMain, IpcRenderer } from "electron";
import { getLobbyCode } from "./utils/cypto";
import Store = require("electron-store");
import { execAsAdmin } from "./utils/ahk";


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

ipcMain.on("create-lobby", async (event: IpcRendererEvent) => {
    // Get public ip and open port
    const lobbyCode = await getLobbyCode();

    console.log(lobbyCode);

    event.sender.send("create-lobby-response", { lobbyCode });
});

ipcMain.on("join-lobby", async (event: IpcRendererEvent, lobbyCode: string) => {

    console.log("fired Join-lobby from main", lobbyCode);

    await execAsAdmin("blockUserInput");
    await execAsAdmin("bringToForeground");
    await execAsAdmin("hoverOnPlay");

    // TODO: pass into executePlay a time relative to the system clock to
    // fire the play action.

    await execAsAdmin("executePlay");

    event.sender.send("create-lobby-response");
});

ipcMain.on("store-name", async (_: IpcRendererEvent, name: string) => {
    // Persistently store user name
    store.set("name", name);
});

ipcMain.on("exit-app", async () => {
    // Quit the application
    app.quit();
});
