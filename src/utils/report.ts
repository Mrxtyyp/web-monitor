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

/**
 * 向下兼容发送信号的方法
 */
 const sendReport = navigator.sendBeacon
 ? (url: string, data: any) => {
   if (data) navigator.sendBeacon(url, JSON.stringify(data));
 }
 : (url: string, data: any) => {
   // 传统方式传递参数
   const beacon = new Image();
   beacon.src = `${url}?v=${encodeURIComponent(JSON.stringify(data))}`;
 };

const send = (data: ReportErrorData) => {
    const common = getCommonData()
    console.log({
        ...common,
        ...data
    });

    sendReport(monitorSdk.config.target, {
        ...common,
        ...data
    })
}

export default {
    send
}