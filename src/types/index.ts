export type MonitorConfig = {
    userOnline: boolean
    performance: boolean
    jsError: boolean
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

// 单一错误的数据
export type ReportErrorData = {
    errorType: string
    message?: string
    filename: string
    tagName?: string
    position?: string
    stack?: string
    selector?: string
}