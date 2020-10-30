import { DBSchema, openDB } from "idb";

interface SettingsDB extends DBSchema {
    settings: {
        key: string,
        value: string
    }
}


async function getDb() {
    return await openDB<SettingsDB>('settings', 1, {
        upgrade (db) {
            db.createObjectStore('settings');
        }
    })
}

export async function getSetting(key : string) {
    const db = await getDb();
    return db.get('settings', key);
}

export async function setValue(key : string, value : string) {
    const db = await getDb();
    await db.put('settings', value, key);
}

export default {
    getSetting,
    setValue
}