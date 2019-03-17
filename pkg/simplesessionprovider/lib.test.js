const uuid = require('uuid/v4');
const sessionProvider = require('./lib');
const _ = require('lodash');

const NON_STRING_VALUES = [0, 1, 3.14, -3, false, true, null, () => {}, {}, []];
const NON_OBJECT_VALUES = [0, 1, 3.14, -3, false, true, null, () => {}, 'string', []];

describe('Simple sessionprovider', () => {
    describe('__disuwareInit', () => {
        test('The init function should return a promise', () => {
            const returnValueOfInit = sessionProvider.__disuwareInit();

            expect(returnValueOfInit instanceof Promise).toBeTruthy();
        });

        test('The init function should return a promise that resolves', () => {
            return sessionProvider.__disuwareInit();
        });
    });

    describe('createSession', () => {
        beforeEach(() => sessionProvider.__disuwareInit());

        test('createSession should not throw an error', () => {
            const testFunction = () => sessionProvider.createSession();

            expect(testFunction).not.toThrow();
        });

        test('createSession should return a promise', () => {
            const returnValue = sessionProvider.createSession();

            expect(returnValue).toBeInstanceOf(Promise);
        });

        test('createSession should return a promise resolving to a string', () => {
            const returnValue = sessionProvider.createSession();

            return expect(returnValue).resolves.toEqual(expect.any(String));
        });
    });

    describe('hasSession', () => {
        beforeEach(() => sessionProvider.__disuwareInit());

        test('hasSession should return not throw an error', () => {
            const sessionKey = uuid();
            const testFunction = () => sessionProvider.hasSession(sessionKey);

            expect(testFunction).not.toThrow();
        });

        _.forEach(NON_STRING_VALUES, (aNonStringSessionKey) => {
            test(`hasSession should return a rejecting promise calling it with argument of type "${toString.call(aNonStringSessionKey)}"`, () => {
                const returnValue = sessionProvider.hasSession(aNonStringSessionKey);

                expect(returnValue).rejects.toBeInstanceOf(TypeError);
            });
        });

        test('hasSession should return a promise', () => {
            const sessionKey = uuid();
            const returnValue = sessionProvider.hasSession(sessionKey);

            expect(returnValue).toBeInstanceOf(Promise);
        });

        test('hasSession should return a promise resolving to a boolean', () => {
            const sessionKey = uuid();
            const returnValue = sessionProvider.hasSession(sessionKey);

            return expect(returnValue).resolves.toEqual(expect.any(Boolean));
        });

        test('hasSession should return false when the session does not exist', () => {
            const sessionKey = uuid();
            const returnValue = sessionProvider.hasSession(sessionKey);

            return expect(returnValue).resolves.toBe(false);
        });

        test('hasSession should return true after a session was created and exists', () => {
            const promiseChain = sessionProvider.createSession()
                .then((aSessionKey) => sessionProvider.hasSession(aSessionKey));

            return expect(promiseChain).resolves.toBe(true);
        });
    });

    describe('deleteSession', () => {
        beforeEach(() => sessionProvider.__disuwareInit());

        test('deleteSession should not throw an error', () => {
            const sessionKey = uuid();
            const testFunction = () => sessionProvider.deleteSession(sessionKey);

            expect(testFunction).not.toThrow();
        });

        _.forEach(NON_STRING_VALUES, (aNonStringSessionKey) => {
            test(`deleteSession should return a rejecting promise calling it with argument of type "${toString.call(aNonStringSessionKey)}"`, () => {
                const returnValue = sessionProvider.deleteSession(aNonStringSessionKey);

                expect(returnValue).rejects.toBeInstanceOf(TypeError);
            });
        });

        test('deleteSession should return a promise', () => {
            const sessionKey = uuid();
            const returnValue = sessionProvider.deleteSession(sessionKey);

            expect(returnValue).toBeInstanceOf(Promise);
        });

        test('deleteSession should return a promise resolving to undefined', () => {
            const sessionKey = uuid();
            const returnValue = sessionProvider.deleteSession(sessionKey);

            return expect(returnValue).resolves.toBeUndefined();
        });

        test('deleteSession sould return delete a session that existed', () => {
            const promiseChain = sessionProvider.createSession()
                .then((aSessionKey) => sessionProvider.deleteSession(aSessionKey).then(() => aSessionKey))
                .then((aSessionKey) => sessionProvider.hasSession(aSessionKey));

            return expect(promiseChain).resolves.toBe(false);
        });
    });

    describe('setRights', () => {
        let sessionKey = null;

        beforeEach(() =>
            sessionProvider.__disuwareInit()
                .then(() => sessionProvider.createSession())
                .then((aSessionKey) => {
                    sessionKey = aSessionKey;
                })
        );

        test('setRights should not throw an error', () => {
            const testFunction = () => sessionProvider.setRights(sessionKey, ['test']);

            expect(testFunction).not.toThrow();
        });

        test('setRights should return a promise', () => {
            const returnValue = sessionProvider.setRights(sessionKey, ['test']);

            expect(returnValue).toBeInstanceOf(Promise);
        });

        _.forEach(NON_STRING_VALUES, (aNonStringSessionKey) => {
            test(`setRights should return a rejecting promise calling it with sessionKey of type "${toString.call(aNonStringSessionKey)}"`, () => {
                const returnValue = sessionProvider.setRights(aNonStringSessionKey, ['test']);

                return expect(returnValue).rejects.toBeInstanceOf(TypeError);
            });

            test(`setRights should return a rejecting promise calling it with rightslist containing data of type "${toString.call(aNonStringSessionKey)}"`, () => {
                const returnValue = sessionProvider.setRights(sessionKey, [aNonStringSessionKey]);

                return expect(returnValue).rejects.toBeInstanceOf(TypeError);
            });
        });

        test('setRights should fail, if the session to extend with rights does not exist', () => {
            const localSessionKey = uuid();
            const returnValue = sessionProvider.setRights(localSessionKey, ['test']);

            return expect(returnValue).rejects.toBeInstanceOf(Error);
        });
    });

    describe('hasRights', () => {
        let sessionKey = null;

        beforeEach(() =>
            sessionProvider.__disuwareInit()
                .then(() => sessionProvider.createSession())
                .then((aSessionKey) => {
                    sessionKey = aSessionKey;
                })
        );

        test('hasRights should not throw an error getting called with a string as right', () => {
            const testFunction = () => sessionProvider.hasRights(sessionKey, 'test');

            expect(testFunction).not.toThrow();
        });

        test('hasRights should not throw an error getting called with a string[] as rights', () => {
            const testFunction = () => sessionProvider.hasRights(sessionKey, ['test']);

            expect(testFunction).not.toThrow();
        });

        _.forEach(NON_STRING_VALUES, (aNonStringSessionKey) => {
            test(`hasRights should return a rejecting promise calling it with sessionKey of type "${toString.call(aNonStringSessionKey)}"`, () => {
                const returnValue = sessionProvider.hasRights(aNonStringSessionKey, ['test']);

                return expect(returnValue).rejects.toBeInstanceOf(TypeError);
            });

            test(`setRights should return a rejecting promise calling it with rightslist containing data of type "${toString.call(aNonStringSessionKey)}"`, () => {
                const returnValue = sessionProvider.hasRights(sessionKey, [aNonStringSessionKey]);

                return expect(returnValue).rejects.toBeInstanceOf(TypeError);
            });
        });

        test('hasRights should fail, if the session to extend with rights does not exist', () => {
            const localSessionKey = uuid();
            const returnValue = sessionProvider.hasRights(localSessionKey, ['test']);

            return expect(returnValue).rejects.toBeInstanceOf(Error);
        });

        test('hasRights should return a boolean false value if the user has not the given right', () => {
            const promiseChain = sessionProvider.setRights(sessionKey, ['test'])
                .then(() => sessionProvider.hasRights(sessionKey, ['nottest']));

            return expect(promiseChain).resolves.toBe(false);
        });

        test('hasRights should return a boolean true value if the user has the given right', () => {
            const promiseChain = sessionProvider.setRights(sessionKey, ['test'])
                .then(() => sessionProvider.hasRights(sessionKey, ['test']));

            return expect(promiseChain).resolves.toBe(true);
        });

        test('hasRights should return a boolean false if one of the given rights is not present', () => {
            const promiseChain = sessionProvider.setRights(sessionKey, ['test'])
                .then(() => sessionProvider.hasRights(sessionKey, ['test', 'other']));

            return expect(promiseChain).resolves.toBe(false);
        });

        test('hasRights should return a boolean true if all of the given rights are present', () => {
            const promiseChain = sessionProvider.setRights(sessionKey, ['test', 'other', 'notrelated'])
                .then(() => sessionProvider.hasRights(sessionKey, ['test', 'other']));

            return expect(promiseChain).resolves.toBe(true);
        });
    });

    describe('getData', () => {
        let sessionKey = null;

        beforeEach(() =>
            sessionProvider.__disuwareInit()
                .then(() => sessionProvider.createSession())
                .then((aSessionKey) => {
                    sessionKey = aSessionKey;
                })
        );

        test('getData should not throw an error', () => {
            const testFunction = () => sessionProvider.getData(sessionKey, 'test');

            expect(testFunction).not.toThrow();
        });

        test('getData should not throw an error when the second parameter is missing', () => {
            const testFunction = () => sessionProvider.getData(sessionKey);

            expect(testFunction).not.toThrow();
        });

        test('getData should return a promise', () => {
            const returnValue = sessionProvider.getData(sessionKey, 'test');

            expect(returnValue).toBeInstanceOf(Promise);
        });

        _.forEach(NON_STRING_VALUES, (aNonStringSessionKey) => {
            test(`getData should return a rejecting promise calling it with sessionKey of type "${toString.call(aNonStringSessionKey)}"`, () => {
                const returnValue = sessionProvider.getData(aNonStringSessionKey, 'test');

                return expect(returnValue).rejects.toBeInstanceOf(TypeError);
            });

            test(`getData should return a rejecting promise calling it with a dataPath of type "${toString.call(aNonStringSessionKey)}"`, () => {
                const returnValue = sessionProvider.getData(sessionKey, aNonStringSessionKey);

                return expect(returnValue).rejects.toBeInstanceOf(TypeError);
            });
        });

        test('getData should fail, if the session to get data from does not exist', () => {
            const localSessionKey = uuid();
            const returnValue = sessionProvider.getData(localSessionKey, 'test');

            return expect(returnValue).rejects.toBeInstanceOf(Error);
        });

        test('getData should return an empty object when the session is valid, but no data is set', () => {
            const returnValue = sessionProvider.getData(sessionKey);

            expect(returnValue).resolves.toEqual(expect.any(Object));
        });

        test('getData should return a frozen initial object', () => {
            return sessionProvider.getData(sessionKey)
                .then((aData) => expect(Object.isFrozen(aData)).toBe(true));
        });
    });

    describe('updateData', () => {
        let sessionKey = null;

        beforeEach(() =>
            sessionProvider.__disuwareInit()
                .then(() => sessionProvider.createSession())
                .then((aSessionKey) => {
                    sessionKey = aSessionKey;
                })
        );

        test('updateData should not throw an error', () => {
            const testFunction = () => sessionProvider.updateData(sessionKey, {test: true});

            expect(testFunction).not.toThrow();
        });

        test('updateData should return a promise', () => {
            const returnValue = sessionProvider.updateData(sessionKey, {test: true});

            expect(returnValue).toBeInstanceOf(Promise);
        });

        _.forEach(NON_STRING_VALUES, (aNonStringSessionKey) => {
            test(`updateData should return a rejecting promise calling it with sessionKey of type "${toString.call(aNonStringSessionKey)}"`, () => {
                const returnValue = sessionProvider.updateData(aNonStringSessionKey, {test: true});

                return expect(returnValue).rejects.toBeInstanceOf(TypeError);
            });
        });

        _.forEach(NON_OBJECT_VALUES, (aNonObjectData) => {
            test(`updateData should return a rejecting promise calling it with data of type "${toString.call(aNonObjectData)}"`, () => {
                const returnValue = sessionProvider.updateData(sessionKey, aNonObjectData);

                return expect(returnValue).rejects.toBeInstanceOf(TypeError);
            });
        });

        test('updateData should fail, if the session to get data from does not exist', () => {
            const localSessionKey = uuid();
            const returnValue = sessionProvider.updateData(localSessionKey, {test: true});

            return expect(returnValue).rejects.toBeInstanceOf(Error);
        });

        test('updateData should merge given data in the session data', () => {
            const dataToWrite = {test: Math.random()};
            const promiseChain = Promise.resolve()
                .then(() => sessionProvider.updateData(sessionKey, dataToWrite))
                .then(() => sessionProvider.getData(sessionKey));

            return expect(promiseChain).resolves.toEqual(dataToWrite);
        });

        test('updateData should create a newly merged object when writing data', () => {
            const dataToWrite = {test: Math.random()};
            const promiseChain = Promise.resolve()
                .then(() => sessionProvider.updateData(sessionKey, dataToWrite))
                .then(() => sessionProvider.getData(sessionKey));

            return expect(promiseChain).resolves.not.toBe(dataToWrite);
        });

        test('updateData should merge multiple calls to one object when writing data', () => {
            const data1ToWrite = {test1: Math.random()};
            const data2ToWrite = {test2: Math.random()};
            const writtenResult = {
                test1: data1ToWrite.test1,
                test2: data1ToWrite.test2,
            };
            const promiseChain = Promise.resolve()
                .then(() => sessionProvider.updateData(sessionKey, data1ToWrite))
                .then(() => sessionProvider.updateData(sessionKey, data2ToWrite))
                .then(() => sessionProvider.getData(sessionKey));

            return expect(promiseChain).resolves.not.toBe(writtenResult);
        });

        test('updateData should freeze the data before receiving it back by getData', () => {
            const dataToWrite = {test: Math.random()};

            return sessionProvider.getData(sessionKey)
                .then(() => sessionProvider.updateData(sessionKey, dataToWrite))
                .then((aData) => expect(Object.isFrozen(aData)).toBe(true));
        });
    });

    describe('overwriteData', () => {
        let sessionKey = null;

        beforeEach(() =>
            sessionProvider.__disuwareInit()
                .then(() => sessionProvider.createSession())
                .then((aSessionKey) => {
                    sessionKey = aSessionKey;
                })
        );

        test('overwriteData should not throw an error', () => {
            const testFunction = () => sessionProvider.overwriteData(sessionKey, {test: true});

            expect(testFunction).not.toThrow();
        });

        test('overwriteData should return a promise', () => {
            const returnValue = sessionProvider.overwriteData(sessionKey, {test: true});

            expect(returnValue).toBeInstanceOf(Promise);
        });

        _.forEach(NON_STRING_VALUES, (aNonStringSessionKey) => {
            test(`overwriteData should return a rejecting promise calling it with sessionKey of type "${toString.call(aNonStringSessionKey)}"`, () => {
                const returnValue = sessionProvider.overwriteData(aNonStringSessionKey, {test: true});

                return expect(returnValue).rejects.toBeInstanceOf(TypeError);
            });
        });

        _.forEach(NON_OBJECT_VALUES, (aNonObjectData) => {
            test(`overwriteData should return a rejecting promise calling it with data of type "${toString.call(aNonObjectData)}"`, () => {
                const returnValue = sessionProvider.overwriteData(sessionKey, aNonObjectData);

                return expect(returnValue).rejects.toBeInstanceOf(TypeError);
            });
        });

        test('overwriteData should fail, if the session to get data from does not exist', () => {
            const localSessionKey = uuid();
            const returnValue = sessionProvider.overwriteData(localSessionKey, {test: true});

            return expect(returnValue).rejects.toBeInstanceOf(Error);
        });

        test('overwriteData should overwrite the existing data for a session', () => {
            const dataToUpdate = {other: Math.random()};
            const dataToWrite = {test: Math.random()};
            const promiseChain = Promise.resolve()
                .then(() => sessionProvider.updateData(sessionKey, dataToUpdate))
                .then(() => sessionProvider.overwriteData(sessionKey, dataToWrite))
                .then(() => sessionProvider.getData(sessionKey));

            return expect(promiseChain).resolves.toBe(dataToWrite);
        });

        test('overwriteData should freeze the data before receiving it back by getData', () => {
            const dataToWrite = {test: Math.random()};

            return sessionProvider.getData(sessionKey)
                .then(() => sessionProvider.overwriteData(sessionKey, dataToWrite))
                .then((aData) => expect(Object.isFrozen(aData)).toBe(true));
        });
    });
});
