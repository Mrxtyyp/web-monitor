import { MonitorConfig } from "../types/index";

type CommonObj = {
    [propName: string]: any
}

// type GetConfigValue<T extends MonitorConfig> = (obj: T, key: K extends keyof T) => T[K]

/**
 * 获取对象的value
 * @param obj 
 * @param key 
 * @returns 
 */
export const getValue = (obj: CommonObj, key: string) => {
    if(!(obj instanceof Object)) return undefined;
    return obj[key]
}

/**
 * 泛型获取对象的value
 * @param obj 
 * @param key 
 * @returns 
 */
export function getObjectValue<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key]
}
