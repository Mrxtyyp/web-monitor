import { parseJsError, parsePromiseError, parseSourceError } from "../utils/errorParse";
import report from '../utils/report'

function initJsMonitor() {
    // promise Error
    const unhandledrejection = (error: PromiseRejectionEvent) => {
        report.send(parsePromiseError(error))
    }
    window.addEventListener("unhandledrejection", unhandledrejection);

    // JS Error
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
}



export default initJsMonitor