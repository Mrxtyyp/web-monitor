import { ReportCommonData, ReportErrorData } from "../types/index"
import userAgent from '../utils/userAgent'

function getCommonData(): ReportCommonData {
    return {
        title: document.title,
        url: location.href,
        timestamp: Date.now(),
        userAgent: userAgent.parse(navigator.userAgent).name,
    };
}

const send = (data: ReportErrorData) => {
    const common = getCommonData()
    console.log({
        ...common,
        ...data
    });
}

export default {
    send
}