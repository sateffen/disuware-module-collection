jest.mock('fs');
jest.mock('minimist');

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const configProvider = require('./lib');

describe('Simple configprovider', () => {
    beforeEach(() => {
        minimist.mockReset();
        fs.readFileSync.mockReset();
    });

    describe('__disuwareInit', () => {
        test('The init function should return a promise', () => {
            minimist.mockReturnValueOnce({});
            fs.readFileSync.mockReturnValueOnce('{}');
            const returnValueOfInit = configProvider.__disuwareInit();

            expect(returnValueOfInit instanceof Promise).toBeTruthy();
        });

        test('The init function should return a promise that resolves', () => {
            minimist.mockReturnValueOnce({});
            fs.readFileSync.mockReturnValueOnce('{}');
            return configProvider.__disuwareInit()
                .then(() => expect(true).toBe(true));
        });

        test('The init function should resolve to the default config-file', () => {
            minimist.mockReturnValueOnce({});
            fs.readFileSync.mockReturnValueOnce('{}');
            const resultPath = path.join(process.cwd(), './config.json');

            return configProvider.__disuwareInit()
                .then(() => expect(fs.readFileSync.mock.calls[0][0]).toBe(resultPath));
        });

        test('The init function should resolve to the passed config-file', () => {
            minimist.mockReturnValueOnce({'simpleconfigprovider-file': './my-own-conf.json'});
            fs.readFileSync.mockReturnValueOnce('{}');
            const resultPath = path.resolve(process.cwd(), './my-own-conf.json');

            return configProvider.__disuwareInit()
                .then(() => expect(fs.readFileSync.mock.calls[0][0]).toBe(resultPath));
        });
    });

    describe('hasKey', () => {
        const existingConfigKey = Math.random().toString(36).slice(2);
        const nonExistingConfigKey = Math.random().toString(36).slice(2);
        const testConfig = {
            [existingConfigKey]: Math.random(),
        };

        beforeEach(() => {
            minimist.mockReturnValueOnce({});
            fs.readFileSync.mockReturnValueOnce(JSON.stringify(testConfig));

            return configProvider.__disuwareInit();
        });

        test('hasKey should not throw an error for existing keys', () => {
            const testFunction = () => configProvider.hasKey(existingConfigKey);

            expect(testFunction).not.toThrow();
        });

        test('hasKey should not throw an error for not existing keys', () => {
            const testFunction = () => configProvider.hasKey(nonExistingConfigKey);

            expect(testFunction).not.toThrow();
        });

        test('hasKey should return a promise', () => {
            const returnValue = configProvider.hasKey(existingConfigKey);

            expect(returnValue instanceof Promise).toBeTruthy();
        });

        test('hasKey should return a promise resolving to true for an existing key', () => {
            const returnValue = configProvider.hasKey(existingConfigKey);

            return expect(returnValue).resolves.toBe(true);
        });

        test('hasKey should return a promise resolving to false for a missing key', () => {
            const returnValue = configProvider.hasKey(nonExistingConfigKey);

            return expect(returnValue).resolves.toBe(false);
        });
    });

    describe('getKey', () => {
        const existingConfigKey = Math.random().toString(36).slice(2);
        const nonExistingConfigKey = Math.random().toString(36).slice(2);
        const testConfig = {
            [existingConfigKey]: Math.random(),
        };

        beforeEach(() => {
            minimist.mockReturnValueOnce({});
            fs.readFileSync.mockReturnValueOnce(JSON.stringify(testConfig));

            return configProvider.__disuwareInit();
        });

        test('getKey should not throw an error for existing keys', () => {
            const testFunction = () => configProvider.getKey(existingConfigKey);

            expect(testFunction).not.toThrow();
        });

        test('getKey should not throw an error for not existing keys', () => {
            const testFunction = () => configProvider.getKey(nonExistingConfigKey);

            expect(testFunction).not.toThrow();
        });

        test('getKey should return a promise', () => {
            const returnValue = configProvider.getKey(existingConfigKey);

            expect(returnValue instanceof Promise).toBeTruthy();
        });

        test('getKey should return a promise resolving to the actual value for an existing key', () => {
            const returnValue = configProvider.getKey(existingConfigKey);

            return expect(returnValue).resolves.toBe(testConfig[existingConfigKey]);
        });

        test('getKey should return a promise resoling to undefined for a non existing key', () => {
            const returnValue = configProvider.getKey(nonExistingConfigKey);

            return expect(returnValue).resolves.toBe(testConfig[nonExistingConfigKey]);
        });
    });
});
