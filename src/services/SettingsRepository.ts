import { DBSchema, IDBPDatabase, openDB } from "idb";

interface SettingsDB extends DBSchema {
    settings: {
        key: string,
        value: string
    }
}

export class SettingsRepository {
    private static _curent : SettingsRepository;

    public static async getCurent() {
        if(!this._curent) {
            this._curent = new SettingsRepository();
            await this._curent.initialize();
        }
        return this._curent;
    }

    private db!: IDBPDatabase<SettingsDB>;

    private constructor() {

    }

    private async initialize() {
        console.log('initializing settigns repo');

        this.db = await openDB<SettingsDB>('settings', 1, {
            upgrade (db) {
                db.createObjectStore('settings');
            }
        })
    }

    public getSetting(key : string) {
        return this.db.get('settings', key);
    }

    public async setValue(key : string, value : string) {
        await this.db.put('settings', value, key);
    }
}