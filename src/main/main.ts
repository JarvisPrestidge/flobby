import * as path from "path";
import * as url from "url";
import C from "./constants";
import global from "./utils/global";
import { app, BrowserWindow } from "electron";
import "./events";
import "./utils/store";
// import uPnP from "./nat/uPnP";

let mainWindow: Electron.BrowserWindow;

const createWindow = () => {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        frame: false,
        autoHideMenuBar: true
    });

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

    // Start to attempt discovery of supported uPnP router
    // uPnP.startDiscovery();

    mainWindow.on("closed", () => {
        mainWindow = null as any;
    });
}

app.on("ready", () => {
    createWindow();
    global.app = app;
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
