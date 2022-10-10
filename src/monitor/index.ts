import monitorSdk from "..";
import { parseJsError, parsePromiseError, parseSourceError } from "../utils/errorParse";
import report from '../utils/report'


// promise Error
const unhandledrejection = (error: PromiseRejectionEvent) => {
    report.send(parsePromiseError(error))
}

// JS Error 资源异常
const errorEvent = (error: ErrorEvent) => {
    // js 异常
    if(error.cancelable) {
        report.send(parseJsError(error))
    } else {
        // 资源加载异常
        report.send(parseSourceError(error))
    }
}

// 劫持console.error
const consoleError = console.error;

/**
 * 初始化JS监听
 * 初始化Promise
 * 初始化资源加载监听
 * log.error
 */
 export const initJsMonitor = () => {
    monitorSdk.debugLogMsg('初始化JS、资源加载、Promise、log.error监听')
    
    window.addEventListener("unhandledrejection", unhandledrejection);

    
    window.addEventListener("error", errorEvent, true);

    
    console.error = function ce(...args) {
        args.forEach((e) => { report.send(parseJsError(e)) });
        consoleError.apply(console, args);
    };
}

export const cancelJsMonitor = () => {
    monitorSdk.waringLogMsg('取消JS监听器')

    window.removeEventListener("unhandledrejection", unhandledrejection);

    window.removeEventListener("error", errorEvent, true);

    console.error = consoleError;
}