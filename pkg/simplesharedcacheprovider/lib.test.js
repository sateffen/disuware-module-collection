const sharedCacheProvider = require('./lib');

describe('Simple sharedcacheprovider', () => {
    describe('__disuwareInit', () => {
        test('The init function should return a promise', () => {
            const returnValueOfInit = sharedCacheProvider.__disuwareInit();

            expect(returnValueOfInit instanceof Promise).toBeTruthy();
        });

        test('The init function should return a promise that resolves', () => {
            return sharedCacheProvider.__disuwareInit();
        });
    });

    describe('setValue and getValue', () => {
        beforeEach(() => sharedCacheProvider.__disuwareInit());

        test('setValue should not throw an error', () => {
            const testFunction = () => sharedCacheProvider.setValue('setKey', 'value');

            expect(testFunction).not.toThrow();
        });

        test('setValue should return a promise', () => {
            const setValueReturnValue = sharedCacheProvider.setValue('setKey', 'value');

            expect(setValueReturnValue instanceof Promise).toBe(true);
        });

        test('The promise returned by setValue should resolve', () => {
            return sharedCacheProvider.setValue('key', 'value');
        });

        test('getValue should not throw an error', () => {
            const testFunction = () => sharedCacheProvider.getValue('getKey');

            expect(testFunction).not.toThrow();
        });

        test('getValue should return a promise', () => {
            const setValueReturnValue = sharedCacheProvider.getValue('getKey');

            expect(setValueReturnValue instanceof Promise).toBe(true);
        });

        test('getValue should resolve with undefined if the requested value does not exist', () => {
            return expect(sharedCacheProvider.getValue('nonExistent')).resolves.toBeUndefined();
        });

        test('getValue should return the correct value if it was set previously', () => {
            const key = Math.random().toString(36).slice(2);
            const value = Math.random().toString(36).slice(2);

            const promiseChain = sharedCacheProvider.setValue(key, value)
                .then(() => sharedCacheProvider.getValue(key));

            return expect(promiseChain).resolves.toBe(value);
        });
    });

    describe('hasValue', () => {
        beforeEach(() => sharedCacheProvider.__disuwareInit());

        test('hasValue should not throw an error', () => {
            const testFunction = () => sharedCacheProvider.hasValue('hasKey');

            expect(testFunction).not.toThrow();
        });

        test('hasValue should return a promise', () => {
            const hasValueReturnValue = sharedCacheProvider.hasValue('hasKey');

            expect(hasValueReturnValue instanceof Promise).toBe(true);
        });

        test('hasValue should resolve with "false" if the value is not existing', () => {
            return expect(sharedCacheProvider.hasValue('hasKey')).resolves.toBe(false);
        });

        test('hasValue should resolve with "true" if the value is existing', () => {
            const key = Math.random().toString(36).slice(2);
            const value = Math.random().toString(36).slice(2);
            const promiseChain = sharedCacheProvider.setValue(key, value)
                .then(() => sharedCacheProvider.hasValue(key));

            return expect(promiseChain).resolves.toBe(true);
        });
    });

    describe('deleteValue', () => {
        beforeEach(() => sharedCacheProvider.__disuwareInit());

        test('deleteValue should not throw an error', () => {
            const testFunction = () => sharedCacheProvider.deleteValue('deleteKey');

            expect(testFunction).not.toThrow();
        });

        test('deleteValue should return a promise', () => {
            const deleteValueReturnValue = sharedCacheProvider.deleteValue('deleteKey');

            expect(deleteValueReturnValue instanceof Promise).toBe(true);
        });

        test('deleteValue should resolve as promise', () => {
            return expect(sharedCacheProvider.deleteValue('deleteKey')).resolves.toBeUndefined();
        });

        test('deleteValue should delete the value as expected', () => {
            const key = Math.random().toString(36).slice(2);
            const value = Math.random().toString(36).slice(2);
            const promiseChain = sharedCacheProvider.setValue(key, value)
                .then(() => sharedCacheProvider.deleteValue(key))
                .then(() => sharedCacheProvider.hasValue(key));

            return expect(promiseChain).resolves.toBe(false);
        });
    });
});
