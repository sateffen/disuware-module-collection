const cacheMap = new Map();

module.exports = {
    getValue(aKey) {
        if (cacheMap.has(aKey)) {
            return Promise.resolve(cacheMap.get(aKey));
        }

        return Promise.reject();
    },
    setValue(aKey, aValue) {
        cacheMap.set(aKey, aValue);

        return Promise.resolve();
    },
    hasValue(aKey) {
        return cacheMap.has(aKey) ? Promise.reject() : Promise.resolve();
    },
    deleteValue(aKey) {
        cacheMap.delete(aKey);

        return Promise.resolve();
    },
};
