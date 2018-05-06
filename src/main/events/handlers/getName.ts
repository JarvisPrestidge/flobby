import { eventHandler } from "../../utils/events";
import { store } from "../../utils/store";

/**
 * Responsible for handling the starting of a new game
 *
 * @returns {void}
 */
eventHandler<string>("get-name-sync", async (event) => {

    // Persistently store user name
    let name = store.get("user.name");

    if (!name) {
        name = "";
    }

    // Respond with name
    event.returnValue = name;
});

/**
 * Responsible for handling the starting of a new game
 *
 * @returns {void}
 */
eventHandler<string>("get-name-async", async (event) => {

    // Persistently store user name
    let name = store.get("user.name");

    if (!name) {
        name = "";
    }

    // Respond with name
    event.sender.send("get-name-async-response", name);
});
