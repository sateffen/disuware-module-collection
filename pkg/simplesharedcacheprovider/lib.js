/**
 * A map holding given data as cache
 * @type {Map<string, any>}
 */
const cacheMap = new Map();

/**
 * Gets given key from the cache
 * @param {string} aKey
 * @return {Promise<any>}
 */
function getValue(aKey) {
    return Promise.resolve(cacheMap.get(aKey));
}

/**
 * Sets given key to given value
 * @param {string} aKey
 * @param {any} aValue
 * @return {Promise<void>}
 */
function setValue(aKey, aValue) {
    cacheMap.set(aKey, aValue);

    return Promise.resolve();
}

/**
 * Checks whether given key is present in the cache. The returned promise will resolve or reject depending of the existence
 * @param {string} aKey
 * @return {Promise<boolean>}
 */
function hasValue(aKey) {
    return Promise.resolve(cacheMap.has(aKey));
}

/**
 * Deletes the cached value with given key
 * @param {string} aKey
 * @return {Promise<void>}
 */
function deleteValue(aKey) {
    cacheMap.delete(aKey);

    return Promise.resolve();
}

/**
 * Initializes this module. Needed for proper testing
 * @private
 * @return {Promise<void>}
 */
function __disuwareInit() {
    cacheMap.clear();

    return Promise.resolve();
}

module.exports = {
    __disuwareInit,
    getValue,
    setValue,
    hasValue,
    deleteValue,
};
