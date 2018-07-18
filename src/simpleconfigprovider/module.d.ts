declare module "disuware!configprovider" {
    export function hasKey(key: string): Promise<void>;
    export function getKey(key: string): Promise<any>;
}
