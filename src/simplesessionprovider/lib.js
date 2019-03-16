const uuid = require('uuid/v4');
const shiroTrie = require('shiro-trie');
const _ = require('lodash');

/**
 * The session store
 * @type {Map<string, Object>}
 */
const sessionStore = new Map();

/**
 * Creates a new session and returns the session key
 * @return {Promise<string>}
 */
function createSession() {
    const sessionId = uuid();
    const sessionModel = {
        shiroModel: shiroTrie.newTrie(),
        data: {},
    };

    sessionStore.set(sessionId, sessionModel);

    return Promise.resolve(sessionId);
}

/**
 * Checks whether a session with given sessionkey exists
 * @param {string} aSessionKey
 * @return {Promise<boolean>} A promise resolving with the result, whether the sessionstore contains this session
 */
function hasSession(aSessionKey) {
    if (!_.isString(aSessionKey)) {
        return Promise.reject(new TypeError('disuware!sessionprovider hasSession: First parameter has to be of type string'));
    }

    return Promise.resolve(sessionStore.has(aSessionKey));
}

/**
 * Deletes a session with given sessionkey
 * @param {string} aSessionKey
 * @return {Promise<void>}
 */
function deleteSession(aSessionKey) {
    if (!_.isString(aSessionKey)) {
        return Promise.reject(new TypeError('disuware!sessionprovider deleteSession: First parameter has to be of type string'));
    }

    sessionStore.delete(aSessionKey);

    return Promise.resolve();
}

/**
 * Sets and overwrites the rights for given sessionkey
 * @param {string} aSessionKey
 * @param {string[]} aRights
 * @return {Promise<void>}
 */
function setRights(aSessionKey, aRights) {
    if (!_.isString(aSessionKey)) {
        return Promise.reject(new TypeError('disuware!sessionprovider setRights: First parameter has to be of type string'));
    }
    else if (!Array.isArray(aRights) || !_.every(aRights, _.isString)) {
        return Promise.reject(new TypeError('disuware!sessionprovider setRights: Second parameter has to be an array of strings'));
    }

    if (sessionStore.has(aSessionKey)) {
        const session = sessionStore.get(aSessionKey);

        session.shiroModel.add(aRights);
        sessionStore.set(aSessionKey, session);

        return Promise.resolve();
    }

    return Promise.reject(new Error('disuware!sessionprovider setRights: Session does not exist'));
}

/**
 * Checks if the session with given key has all rights, and returns a promise based on the result
 * @param {string} aSessionKey
 * @param {string|string[]} aRights
 * @return {Promise<boolean>} A promise telling whether the user has needed rights or not
 */
function hasRights(aSessionKey, aRights) {
    if (!_.isString(aSessionKey)) {
        return Promise.reject(new TypeError('disuware!sessionprovider hasRight: First parameter has to be of type string'));
    }

    const rights = _.isString(aRights) ? [aRights] : aRights;

    if (!Array.isArray(rights) || !_.every(rights, _.isString)) {
        return Promise.reject(new TypeError('disuware!sessionprovider hasRight: Second parameter has to be a string or an array of strings'));
    }

    if (sessionStore.has(aSessionKey)) {
        const session = sessionStore.get(aSessionKey);
        const sessionHasRights = _.every(rights, (aRight) => session.shiroModel.check(aRight));

        return Promise.resolve(sessionHasRights);
    }

    return Promise.reject(new Error('disuware!sessionprovider hasRight: Session does not exist'));
}

/**
 * Retrieves the data stored for sessionkey. If a dataPath is given, only the subpath is returned
 * @param {string} aSessionKey
 * @param {string} [aDataPath]
 * @return {Promise<any>}
 */
function getData(aSessionKey, aDataPath) {
    if (!_.isString(aSessionKey)) {
        return Promise.reject(new TypeError('disuware!sessionprovider getData: First parameter has to be of type string'));
    }
    else if (!_.isUndefined(aDataPath) || !_.isString(aDataPath)) {
        return Promise.reject(new TypeError('disuware!sessionprovider getData: Second parameter has to be of type string or undefined'));
    }

    if (sessionStore.has(aSessionKey)) {
        const session = sessionStore.get(aSessionKey);
        const requestedData = _.isUndefined(aDataPath) ? session.data : _.get(session.data, aDataPath);

        return Promise.resolve(requestedData);
    }

    return Promise.reject(new Error('disuware!sessionprovider getData: Session does not exist'));
}

/**
 * Updates the stored sessiondata with given sessiondata. The data is merged, so if you provide only a subset of data, nothing else is
 * overwritten
 * @param {string} aSessionKey
 * @param {Object} aSessionData
 * @return {Promise<void>}
 */
function updateData(aSessionKey, aSessionData) {
    if (!_.isString(aSessionKey)) {
        return Promise.reject(new TypeError('disuware!sessionprovider updateData: First parameter has to be of type string'));
    }
    else if (!_.isObject(aSessionData)) {
        return Promise.reject(new TypeError('disuware!sessionprovider updateData: Second parameter has to be an object'));
    }

    if (sessionStore.has(aSessionKey)) {
        const session = sessionStore.get(aSessionKey);

        session.data = Object.freeze(_.merge({}, session.data, aSessionData));
        sessionStore.set(aSessionKey, session);

        return Promise.resolve();
    }

    return Promise.reject(new Error('disuware!sessionprovider updateData: Session does not exist'));
}

/**
 * Overwrites the data stored for the given sessionkey. This replaces all data currently stored!
 * @param {string} aSessionKey
 * @param {Object} aSessionData
 * @return {Promise<void>}
 */
function overwriteData(aSessionKey, aSessionData) {
    if (!_.isString(aSessionKey)) {
        return Promise.reject(new TypeError('disuware!sessionprovider overwriteData: First parameter has to be of type string'));
    }
    else if (!_.isObject(aSessionData)) {
        return Promise.reject(new TypeError('disuware!sessionprovider overwriteData: Second parameter has to be an object'));
    }

    if (sessionStore.has(aSessionKey)) {
        const session = sessionStore.get(aSessionKey);

        session.data = Object.freeze(aSessionData);
        sessionStore.set(aSessionKey, session);

        return Promise.resolve();
    }

    return Promise.reject(new Error('disuware!sessionprovider overwriteData: Session does not exist'));
}

/**
 * Initializes this module
 * @return {Promise<void>}
 * @private
 */
function __disuwareInit() {
    sessionStore.clear();

    return Promise.resolve();
}

module.exports = {
    __disuwareInit,

    createSession,
    hasSession,
    deleteSession,

    setRights,
    hasRights,

    getData,
    updateData,
    overwriteData,
};
