import C from "../../constants";
import { eventHandler } from "../../utils/events";
import { execAsyncBinaryAsAdmin } from "../../utils/exec";

/**
 * Responsible for handling the starting of a new game
 *
 * @returns {void}
 */
eventHandler("execute-play", async (event) => {
    await execAsyncBinaryAsAdmin(C.AHK_BINARIES, "blockUserInput");
    await execAsyncBinaryAsAdmin(C.AHK_BINARIES, "bringToForeground");
    await execAsyncBinaryAsAdmin(C.AHK_BINARIES, "hoverOnPlay");

    // TODO: pass into executePlay a time relative to the system clock to
    // fire the play action.

    await execAsyncBinaryAsAdmin(C.AHK_BINARIES, "executePlay");

    event.sender.send("execute-play-response");
});
