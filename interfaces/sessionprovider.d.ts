declare module "disuware!sessionprovider" {
    export function createSession(): Promise<string>;
    export function hasSession(sessionKey: string): Promise<boolean>;
    export function deleteSession(sessionKey: string): Promise<void>;

    export function setRights(sessionKey: string, rights: string[]): Promise<void>;
    export function hasRights(sessionKey: string, rights: string|string[]): Promise<boolean>;

    export function getData(sessionKey: string, dataPath?: string): Promise<any>;
    export function updateData(sessionKey: string, sessionData: object): Promise<void>;
    export function overwriteData(sessionKey: string, sessionData: object): Promise<void>;
}
