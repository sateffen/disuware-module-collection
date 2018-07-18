const uuid = require('uuid/v4');
const shiroTrie = require('shiro-trie');
const _ = require('lodash');

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
 * @return {Promise<string>}
 */
function hasSession(aSessionKey) {
    return sessionStore.has(aSessionKey) ? Promise.resolve() : Promise.reject();
}

/**
 * Deletes a session with given sessionkey
 * @param {string} aSessionKey
 * @return {Promise<void>}
 */
function deleteSession(aSessionKey) {
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

    return Promise.reject();
}

/**
 * Checks if the session with given key has all rights, and returns a promise based on the result
 * @param {string} aSessionKey
 * @param {string|string[]} aRights
 * @return {Promise<never>}
 */
function hasRights(aSessionKey, aRights) {
    if (!_.isString(aSessionKey)) {
        return Promise.reject(new TypeError('disuware!sessionprovider hasRight: First parameter has to be of type string'));
    }

    const rights = _.isString(aRights) ? [aRights] : aRights;

    if (!_.every(rights, _.isString)) {
        return Promise.reject(new TypeError('disuware!sessionprovider hasRight: Second parameter has to be a string or an array of strings'));
    }

    //TODO: Complete
}

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

    return Promise.reject();
}

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

    return Promise.reject();
}

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

    return Promise.reject();
}

module.exports = {
    createSession,
    hasSession,
    deleteSession,

    setRights,
    hasRights,

    getData,
    updateData,
    overwriteData,
};
