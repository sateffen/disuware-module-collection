const uuid = require('uuid/v4');
const sessionProvider = require('./lib');
const _ = require('lodash');

const NON_STRING_VALUES = [0, 1, 3.14, -3, false, true, null, () => { }, {}, []];

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
            const sessionKey = uuid();
            const returnValue = sessionProvider.setRights(sessionKey, ['test']);

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
});
