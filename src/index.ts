import { ActiveReportError, MonitorOptions } from './types/index';
import { getObjectValue, getObjectValueByPath, getDeviceId } from './utils/common';
import { initJsMonitor, cancelJsMonitor } from './lib/monitor/index';
import initPerformance from './lib/performance';
import report from './utils/report';
import { initRequest, cancelRequest } from './lib/request';
import initHistory from './lib/history/index';
import initUV from './lib/uv';

class Monitor {
  public watchPerformance: boolean;
  public watchUserOnline: boolean;
  public watchJsError: boolean;
  public watchRequest: boolean;
  public watchPv: boolean;
  public watchPvHash: boolean;
  public debug: boolean;
  public config: Record<string, any>;
  constructor() {
    // 当前SDK的模式
    this.debug = false;
    // 是否监控JS错误
    this.watchJsError = false;
    // 是否监控用户在线时长
    this.watchUserOnline = false;
    // 是否监控性能指标
    this.watchPerformance = false;
    // 初始化监听请求
    this.watchRequest = false;
    // 监听统计PV
    this.watchPv = true;
    // 监听路由变化统计PV
    this.watchPvHash = true;
    // 初始化配置
    this.config = Object.create(null);
  }

  async init(config: MonitorOptions) {
    try {
      await this.validateConfig(config);
    } catch (error) {
      this.errorLogMsg(error);
    }

    this.config.deviceId = getDeviceId();

    this.watchJsError && initJsMonitor();

    // 性能监听
    this.watchPerformance && initPerformance();

    // 监听请求
    this.watchRequest && initRequest();

    // 监听页面PV
    this.watchPv && initHistory(this.watchPvHash);

    // 监听用户在线时长
    this.watchUserOnline && initUV();
  }

  /**
   * 校验参数完整性
   * @param config
   * @returns
   */
  validateConfig(config: MonitorOptions) {
    return new Promise((resolve, reject) => {
      if (!config || !Object.keys(config).length) return reject('未传入初始化参数');
      this.config = config;
      const debug = getObjectValue(config, 'debug');
      // 验证mode
      if (typeof debug === 'boolean') {
        this.debug = debug;
      } else {
        this.debug = true;
        this.debugLogMsg('SDK默认采用debug模式');
      }
      const jsError = getObjectValueByPath(config, 'config.jsError');
      jsError !== undefined && (this.watchJsError = !!jsError);
      const userOnline = getObjectValueByPath(config, 'config.userOnline');
      userOnline !== undefined && (this.watchJsError = !!userOnline);
      const performance = getObjectValueByPath(config, 'config.performance');
      performance !== undefined && (this.watchPerformance = !!performance);
      const request = getObjectValueByPath(config, 'config.request');
      request !== undefined && (this.watchRequest = !!request);
      const pv = getObjectValueByPath(config, 'config.pv');
      pv !== undefined && (this.watchPv = !!pv);
      const pvHash = getObjectValueByPath(config, 'config.pvHash');
      pvHash !== undefined && (this.watchPvHash = !!pvHash);
      resolve(true);
    });
  }

  /**
   * 主动上报监控信息
   * @param options
   * @param options.message 错误描述，文字不超过200个，超过后会截取
   * @param options.extra 自定义附加字段，会转成字符串存储
   */
  report(options: Omit<ActiveReportError, 'type' | 'kind'>) {
    // 最大不能超过200字
    if (options.message.length > 200) {
      options.message = options.message.slice(0, 200);
      this.waringLogMsg('message长度不能超过200字符, 自动截断. 截断后为=>', options.message);
    }

    report.send({
      kind: 'business',
      type: 'custom',
      message: options.message,
      extra: options.extra ? JSON.stringify(options.extra) : '',
    });
  }

  /**
   * 设置用户唯一标识
   */
  setUId(uid: string) {
    this.config.userId = uid;
  }

  /**
   * SDK系统报错打印
   * @param args
   */
  errorLogMsg(...args: any[]) {
    console.log('%cSDK Error:%c ' + args.join(' '), 'background: red;color: white;', '');
  }

  /**
   * SDK系统报错打印
   * @param args
   */
  waringLogMsg(...args: any[]) {
    console.log('%cSDK Waring:%c ' + args.join(' '), 'background: orange;color: white;', '');
  }

  /**
   * SDK系统Debug日志
   * @param args
   */
  debugLogMsg(...args: any[]) {
    if (this.debug)
      console.log('%cSDK Debug:%c ' + args.join(' '), 'background: blue;color: white;', '');
  }

  /**
   * 卸载实例，取消监控
   */
  destory() {
    (window as any).monitorSdk = null;
    this.watchJsError && cancelJsMonitor();
    this.watchRequest && cancelRequest();
  }
}

const monitorSdk = new Monitor();
(window as any).monitorSdk = monitorSdk;

export default monitorSdk;
