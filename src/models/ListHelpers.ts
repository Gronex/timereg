export function groupBy<T, K>(list : T[], selector: ((item: T) => K)) {
    const map = new Map<K, T[]>();

    for(const item of list) {
        const key = selector(item);
        if(!map.has(key)){
            map.set(key, []);
        }
        map.get(key)?.push(item);
    }

    const result : {key: K, values: T[]}[] = [];
    map.forEach((values, key) => {
        result.push({key, values});
    });
    return result;
}