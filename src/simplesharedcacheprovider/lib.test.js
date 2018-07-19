const sharedCacheProvider = require('./lib');

describe('Simple sharedcacheprovider', () => {
    describe('__disuwareInit', () => {
        test('The init function should return a promise', () => {
            const returnValueOfInit = sharedCacheProvider.__disuwareInit();

            expect(returnValueOfInit instanceof Promise).toBeTruthy();
        });

        test('The init function should return a promise that resolves', (done) => {
            sharedCacheProvider.__disuwareInit()
                .then(() => {
                    expect(true).toBe(true);
                    done();
                })
                .catch(() => {
                    expect('this').toBe('not happening');
                    done();
                });
        });
    });
});
