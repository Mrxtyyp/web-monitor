import { ReportCommonData, ReportErrorData } from "../types/index"
import userAgent from '../utils/userAgent'

/**
 * 获取需要发送的公共数据
 * @returns 
 */
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