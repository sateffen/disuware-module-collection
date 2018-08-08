declare module "disuware!httpprovider" {
    type HttpRequest = Object;
    type HttpResponse = Object;
    type WebSocket = Object;

    type RouteHandler = (request: HttpResponse, response: HttpRequest, next: () => void) => void;

    export function onWebSocket(handler: (WebSocket: WebSocket) => void): void;

    export function addMiddleware(handler: RouteHandler): void;
    export function addMiddleware(route: string, handler: RouteHandler): void;

    export function onGet(route: string, handler: RouteHandler): void;
    export function onPost(route: string, handler: RouteHandler): void;
    export function onPut(route: string, handler: RouteHandler): void;
    export function onDelete(route: string, handler: RouteHandler): void;
    export function onPatch(route: string, handler: RouteHandler): void;
    export function onOptions(route: string, handler: RouteHandler): void;
    export function onHead(route: string, handler: RouteHandler): void;

    export function onUnknownRoute(handler: RouteHandler): void;
    export function onHttpError(handler: RouteHandler): void;
}
