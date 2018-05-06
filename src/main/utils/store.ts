import Store = require("electron-store");
/**
 * Represents the store data schema
 *
 * @export
 * @interface IStoreSchema
 */
export interface IStoreSchema {
    user: {
        name?: string;
    }
    upnp: {
        support?: boolean;
        location?: string;
        ports?: number[];
        attempt?: number;
    }
}

// Initial store state
const defaults: IStoreSchema = {
    user: {
        name: undefined
    },
    upnp: {
        support: undefined,
        location: undefined,
        ports: []
    }
};

// Create new instance of store
const store = new Store<IStoreSchema>({ defaults });


export { store };
