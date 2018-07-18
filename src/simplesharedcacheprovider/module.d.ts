declare module "disuware!sharedcacheprovider" {
    export function getValue(key: string): Promise<any>;
    export function setValue(key: string, value: any): Promise<void>;
    export function hasValue(key: string): Promise<void>;
    export function deleteValue(key: string): Promise<void>;
}
