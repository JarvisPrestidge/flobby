import { eventHandler } from "../../utils/events";
import { store } from "../../utils/store";

/**
 * Responsible for handling the starting of a new game
 *
 * @returns {void}
 */
eventHandler("set-name", async (_, name) => {

    // Persistently store user name
    store.set("user.name", name);
});
