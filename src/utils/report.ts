import { ReportCommonData, ReportErrorData } from "../types/index"
import userAgent from '../utils/userAgent'
import { getDeviceId } from './common';
import monitorSdk from '..';

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
        d_id: getDeviceId(),
        u_id: monitorSdk.config.userId || ''
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