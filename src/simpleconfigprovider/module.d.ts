declare module "disuware!configprovider" {
    export function hasKey(key: string): Promise<boolean>;
    export function getKey(key: string): Promise<any>;
}
