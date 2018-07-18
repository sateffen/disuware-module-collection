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

module.exports = {
    hasKey(aKey) {
        return configFileData[aKey] === undefined ? Promise.reject() : Promise.resolve();
    },
    getKey(aKey) {
        return Promise.resolve(configFileData[aKey]);
    },
};
