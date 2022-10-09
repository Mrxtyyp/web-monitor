export type MonitorConfig = {
    userOnline: boolean
    performance: boolean
    jsError: boolean
    request: boolean
}

// 需要监控js运行时的报错
// export type MonitorJsConfig = {
//     resourceError: boolean
// }

export type MonitorOptions = {
    target: string
    appId: string
    // 测试模式和运行模式，测试模式不会将数据传输到服务器，仅仅提供打印查看
    debug: boolean
    config: MonitorConfig
}

// 报告的公共数据
export type ReportCommonData = {
    title: string,
    url: string,
    timestamp: number,
    userAgent: string,
    ip?: string
}
// experience 体验  stability 稳定性  business 业务指标
export type ReportErrorKind = 'experience' | 'stability' | 'business'
// error 错误 custom 自定义上报 timing 性能 request 请求
export type ReportErrorType = 'timing' | 'error' | 'custom' | 'request'

export type ReportJsError = {
    errorType?: string
    message?: string
    filename?: string
    tagName?: string
    position?: string
    stack?: string
    selector?: string
    extra?: string
    // 请求状态
    status?: string
    // 请求路径
    pathname?: string
    // 请求持续时长
    duration?: number
    // 请求响应
    response?: string
    params?: any
}

export type ReportPerformance = {
    // 首次可交互时间 tti
    timeToInteractive: number
    // html加载完成时间
    readyTime: number
    // 页面完全加载时间
    loadTime: number
    // dns 耗时
    dnsTime: number
    // DOM 解析耗时
    parseDOMTime: number
    // DOMContentLoaded事件回调耗时
    domContentLoadedTime: number
    // 响应耗时
    responseTime: number
    // 首字节到达耗时
    ttfbTime: number
    // TCP 连接耗时
    connectTime: number
}

type MergeObj<T extends object> = {
    [P in keyof T]: T[P]
}

// 单一错误的数据
export type ReportErrorData = MergeObj<{
    kind?: ReportErrorKind
    type?: ReportErrorType
} & ReportJsError & Partial<ReportPerformance>>


export type ActiveReportError = {
    kind: 'business',
    type: 'custom',
    message: string
    extra: {[p: string]: any}
}