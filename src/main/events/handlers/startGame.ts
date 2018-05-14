import C from "../../constants";
import { execAsyncBinaryAsAdmin } from "../../utils/exec";
import { exitApp } from "./exitApp";
import { log } from "../../utils/logging";


export const startGamePrerequisites = async () => {

    log.info(`[START-GAME-PREREQUISITES]`);

    await execAsyncBinaryAsAdmin(C.getAHKBinaryPath(), "bringToForeground");
    await execAsyncBinaryAsAdmin(C.getAHKBinaryPath(), "dismissUpdate");
    await execAsyncBinaryAsAdmin(C.getAHKBinaryPath(), "hoverOnPlay");
};

export const startGame = async () => {

    // TODO: pass into executePlay a time relative to the system clock to
    // fire the play action.

    log.info(`[START-GAME`);

    await execAsyncBinaryAsAdmin(C.getAHKBinaryPath(), "executePlay");

    exitApp();
};
