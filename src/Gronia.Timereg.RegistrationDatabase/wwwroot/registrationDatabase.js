// This is a JavaScript module that is loaded on demand. It can export any number of
// functions, and may import other JavaScript modules if required.

export function showPrompt(message) {
  return prompt(message, 'Type anything here');
}


import { openDB } from 'https://unpkg.com/idb?module';//'idb';

const db = openDB("time-registrations", 1, {
    upgrade(db) {
        db.createObjectStore("registrations", {
            keyPath: 'id'
        });
    }
});

export async function get(storeName, key) {
    return (await db).get(storeName, key);
}

export async function getAll(storeName) {
    return (await db).getAll(storeName);
}

export async function put(storeName, value) {
    return (await db).put(storeName, value);
}

export async function remove(storeName, key) {
    return (await db).delete(storeName, key);
}