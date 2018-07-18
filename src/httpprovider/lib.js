const polka = require('polka');

const httpConfigSchema = require('./configschema.json');
const Ajv = require('ajv');
const ajv = new Ajv();

const configProvider = require('disuware!configprovider');

const httpServerList = [];
const webSocketServerList = [];

const router = polka();

/**
 * Registers given handler as websocket handler
 * @param {function} aHandler The handler to register
 * @throws Throws an error if there are no webservers to listen for websockets
 */
function registerForWebSockets(aHandler) {
    if (webSocketServerList.length === 0) {
        throw new Error('No websocket server registered');
    }

    for (let i = 0, iLen = webSocketServerList.length; i < iLen; i++) {
        webSocketServerList[i].on('connection', aHandler);
    }
}

/**
 * Initializes the httpserver
 * @param {Promise} aInitCompletedPromise
 * @return {Promise<void>} An empty promise to finish the chain
 * @private
 */
function __disuwareInit(aInitCompletedPromise) {
    const config = configProvider.getKey('httpserver');
    const valid = ajv.validate(httpConfigSchema, config);

    if (!valid) {
        throw new Error(`httpserver configuration is invalid: ${ajv.errorsText()}`);
    }

    if (typeof config.http === 'object') {
        const httpModule = require('http');
        const httpServer = httpModule.createServer(router.handler.bind(router));

        aInitCompletedPromise.then(() => httpServer.listen(config.http.port, config.http.host));
        httpServerList.push(httpServer);
    }

    if (typeof config.https === 'object') {
        const httpsModule = require('https');
        const fsModule = require('fs');

        const httpsServer = httpsModule.createServer(
            {
                key: fsModule.readFileSync(config.https.key),
                cert: fsModule.readFileSync(config.https.cert),
            },
            router.handler.bind(router)
        );


        aInitCompletedPromise.then(() => httpsServer.listen(config.https.port, config.https.host));
        httpServerList.push(httpsServer);
    }

    if (typeof config.websocket === 'object') {
        const wsModule = require('ws');
        const httpServerListLength = httpServerList.length;

        if (httpServerListLength === 0) {
            throw new Error('There are no http servers, can\'t attach websocket listener');
        }

        for (let i = 0; i < httpServerListLength; i++) {
            const webSocketServer = new wsModule.Server({
                server: httpServerList[i],
                path: config.websocket.path,
            });

            webSocketServerList.push(webSocketServer);
        }
    }

    return Promise.resolve();
}

module.exports = {
    __disuwareInit,
    onWebSocket: registerForWebSockets,
    addMiddleware: router.use.bind(router),
    onGet: router.get.bind(router),
    onPost: router.post.bind(router),
    onPut: router.put.bind(router),
    onDelete: router.delete.bind(router),
    onPatch: router.patch.bind(router),
    onOptions: router.options.bind(router),
    onHead: router.head.bind(router),
};
