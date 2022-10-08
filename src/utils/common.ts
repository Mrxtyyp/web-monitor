import { MonitorConfig } from "../types/index";

type CommonObj = {
    [propName: string]: unknown
}

type IsObjectKey<T extends object, P extends string> = P extends keyof T ? true : false;

type ObjGetValueByPath<T extends object, P extends string> = 
    P extends `${infer A}.${infer B}` ? 
        A extends keyof T ? T[A] extends object ? ObjGetValueByPath<T[A], B> : undefined : undefined
    : P extends keyof T ? T[P] : undefined

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

/**
 * 根据传入path获取对象的值
 * @param obj 传入对象
 * @param keyPath 键值的字符串形式 'a.b.c'
 * @returns 对应的值
 */
export function getObjectValueByPath<T extends object, K extends string>(obj: T, keyPath: K): ObjGetValueByPath<T, K> {
    function stringToPath(str: string) {
        const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
        const reEscapeChar = /\\(\\)?/g;
        const result = [];
      if (str.charCodeAt(0) === 46 /* . */) {
        result.push('');
      }
      str.replace(rePropName, function(match, number, quote, subString) {
        const v = quote ? subString.replace(reEscapeChar, '$1') : (number || match)
        result.push(v);
        return v
      });
      return result;
    }
    function baseGet(object: Record<string, any>, paths: string) {
        const path = stringToPath(paths);
        return objectFindValue(object, ...(path as [string, string, string, string]));
      }
    return obj == null ? undefined : baseGet(obj, keyPath);
}

export function isValidKey(
    key: string | number | symbol,
    object: object
): key is keyof typeof object {
    return key in object;
}

function objectFindValue<T extends object, K1 extends keyof T>(obj: T, key1: K1): T[K1]
function objectFindValue<T extends object, K1 extends keyof T, K2 extends keyof T[K1]>(obj: T, key1: K1, key2: K2): T[K1][K2]
function objectFindValue<T extends object, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(obj: T, key1: K1, key2: K2, key3: K3): T[K1][K2][K3]
function objectFindValue<T extends object, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3]>(obj: T, key1: K1, key2: K2, key3: K3, key4: K4): T[K1][K2][K3][K4]
function objectFindValue<T extends Record<string, any>>(obj: T, ...args: string[]) {
    let index = 0, length = args.length;
    while (obj != null && index < length) {
        obj = obj[args[index++]];
    }
    return (index && index == length) ? obj : undefined;
}