// This is a JavaScript module that is loaded on demand. It can export any number of
// functions, and may import other JavaScript modules if required.

import { openDB } from 'idb';

const table = {};

export function initDb(databaseName, version, objectStoreName) {
    console.log("Opening ", databaseName, version, objectStoreName);
    if (table[databaseName]) {
        return;
    }

    const db = openDB(databaseName, version, {
        upgrade(db) {
            db.createObjectStore(objectStoreName, {
                keyPath: 'id'
            });
        }
    });
    table[databaseName] = db;
    return;
}

export async function get(dbName, storeName, key) {
    return (await table[dbName]).get(storeName, key);
}

export async function getAll(dbName, storeName) {
    return (await table[dbName]).getAll(storeName);
}

export async function put(dbName, storeName, value) {
    return (await table[dbName]).put(storeName, value);
}

export async function remove(dbName, storeName, key) {
    return (await table[dbName]).delete(storeName, key);
}