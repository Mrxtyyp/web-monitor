import { getJsError, getPromiseError, getSourceError } from "../utils/errorParse";
import report from '../utils/report'

function initJsMonitor() {
    // promise Error
    const unhandledrejection = (error: PromiseRejectionEvent) => {
        report.send(getPromiseError(error))
    }
    window.addEventListener("unhandledrejection", unhandledrejection);

    // JS Error
    const errorEvent = (error: ErrorEvent) => {
        console.log(error);
        // js 异常
        if(error.cancelable) {
            report.send(getJsError(error))
        } else {
            // 资源加载异常
            report.send(getSourceError(error))
        }
    }
    window.addEventListener("error", errorEvent, true);
}



export default initJsMonitor