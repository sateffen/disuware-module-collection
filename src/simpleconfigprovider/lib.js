const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

const parsedArguments = minimist(process.argv.slice(2));
let configFilePath;

if (typeof parsedArguments['simpleconfigprovider-file'] === 'string') {
    configFilePath = path.resolve(process.cwd(), parsedArguments['simpleconfigprovider-file']);
}
else {
    configFilePath = path.join(process.cwd(), './config.json');
}

const configFileContent = fs.readFileSync(configFilePath).toString();
const configFileData = JSON.parse(configFileContent);

/**
 * Tests whether given key is existent in the config
 * @param {string} aKey
 * @return {Promise<any>}
 */
function hasKey(aKey) {
    return configFileData[aKey] === undefined ? Promise.reject() : Promise.resolve();
}

/**
 * Retrieves the data from given key
 * @param {string} aKey
 * @return {Promise<any>}
 */
function getKey(aKey) {
    return Promise.resolve(configFileData[aKey]);
}

module.exports = {
    hasKey,
    getKey,
};
