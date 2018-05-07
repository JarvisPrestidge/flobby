import C from "../../constants";
import { execAsyncBinaryAsAdmin } from "../../utils/exec";
import { exitApp } from "./exitApp";


export const startGamePrerequisites = async () => {

    await execAsyncBinaryAsAdmin(C.AHK_BINARIES, "blockUserInput");
    await execAsyncBinaryAsAdmin(C.AHK_BINARIES, "bringToForeground");
    await execAsyncBinaryAsAdmin(C.AHK_BINARIES, "hoverOnPlay");
};

export const startGame = async () => {

    // TODO: pass into executePlay a time relative to the system clock to
    // fire the play action.

    await execAsyncBinaryAsAdmin(C.AHK_BINARIES, "executePlay");

    exitApp();
};
