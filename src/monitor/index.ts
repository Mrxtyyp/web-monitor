import monitorSdk from "..";
import { parseJsError, parsePromiseError, parseSourceError } from "../utils/errorParse";
import report from '../utils/report'

/**
 * 初始化JS监听
 * 初始化Promise
 * 初始化资源加载监听
 * log.error
 */
const initJsMonitor = () => {
    monitorSdk.debugLogMsg('SDK Debug: 初始化JS、资源加载、Promise、log.error监听')
    // promise Error
    const unhandledrejection = (error: PromiseRejectionEvent) => {
        report.send(parsePromiseError(error))
    }
    window.addEventListener("unhandledrejection", unhandledrejection);

    // JS Error 资源异常
    const errorEvent = (error: ErrorEvent) => {
        console.log(error);
        // js 异常
        if(error.cancelable) {
            report.send(parseJsError(error))
        } else {
            // 资源加载异常
            report.send(parseSourceError(error))
        }
    }
    window.addEventListener("error", errorEvent, true);

    // 劫持console.error
    const consoleError = console.error;
    console.error = function ce(...args) {
        args.forEach((e) => { report.send(parseJsError(e)) });
        consoleError.apply(console, args);
    };
}



export default initJsMonitor