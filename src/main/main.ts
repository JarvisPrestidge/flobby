import * as path from "path";
import * as url from "url";
import C from "./constants";
import global from "./utils/global";
import uPnP from "./nat/uPnP";
import { app, BrowserWindow } from "electron";
import "./events/register";
import "./utils/store";
import { store } from "./utils/store";

let mainWindow: Electron.BrowserWindow;

const createWindow = () => {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        minHeight: 600,
        minWidth: 800,
        frame: false,
        autoHideMenuBar: true
    });

    // Clear existing local storage
    mainWindow.webContents.session.clearStorageData();

    // Load the generated app index.html
    mainWindow.loadURL(
        url.format({
            pathname: path.join(C.STATIC_FILES, "index.html"),
            protocol: "file",
            slashes: true
        })
    );

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    mainWindow.on("closed", () => {
        mainWindow = null as any;
    });
}

app.on("ready", () => {
    // Create the main window instance
    createWindow();

    // Store reference to main window instance
    global.mainWindow = mainWindow;
    global.appPath = app.getAppPath();

    // Check for uPnP support before discovery
    const hasUPnPSupport = store.get("upnp.support");
    const hasUPnPLocation = store.get("upnp.support");
    if (!hasUPnPSupport || !hasUPnPLocation) {
        // Start to attempt discovery of supported uPnP router
        uPnP.startDiscovery();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
