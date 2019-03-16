const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

let configFileData = null;

/**
 * Tests whether given key is existent in the config
 * @param {string} aKey
 * @return {Promise<boolean>}
 */
function hasKey(aKey) {
    return Promise.resolve(configFileData[aKey] !== undefined);
}

/**
 * Retrieves the data from given key
 * @param {string} aKey
 * @return {Promise<any>}
 */
function getKey(aKey) {
    return Promise.resolve(configFileData[aKey]);
}

/**
 * Initializes this module by reading the config and writing it to the configFileData pointer
 * @return {Promise<void>}
 */
function __disuwareInit() {
    return new Promise((aResolve) => {
        const parsedArguments = minimist(process.argv.slice(2));
        let configFilePath = '';

        if (typeof parsedArguments['simpleconfigprovider-file'] === 'string') {
            configFilePath = path.resolve(process.cwd(), parsedArguments['simpleconfigprovider-file']);
        }
        else {
            configFilePath = path.join(process.cwd(), './config.json');
        }

        const configFileContent = fs.readFileSync(configFilePath).toString();
        configFileData = JSON.parse(configFileContent);

        aResolve();
    });
}

module.exports = {
    __disuwareInit,
    hasKey,
    getKey,
};
