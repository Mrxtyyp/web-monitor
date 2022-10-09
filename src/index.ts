import { MonitorOptions } from './types/index';
import { getObjectValue, getObjectValueByPath } from './utils/common';
import initJsMonitor from './monitor/index';
import initPerformance from './performance'

class Monitor {
  public watchPerformance: boolean;
  public watchUserOnline: boolean;
  public watchJsError: boolean;
  public debug: boolean;
  public config: object;
  constructor() {
    // 当前SDK的模式
    this.debug = false;
    // 是否监控JS错误
    this.watchJsError = true;
    // 是否监控用户在线时长
    this.watchUserOnline = true;
    // 是否监控性能指标
    this.watchPerformance = true;
    // 初始化配置
    this.config = Object.create(null);
  }

  async init(config: MonitorOptions) {
    try {
        await this.validateConfig(config)
    } catch (error) {
        this.errorLogMsg(error)
    }

    
    this.watchJsError && initJsMonitor()

    // 性能监听
    this.watchPerformance && initPerformance.init()
  }

  validateConfig(config: MonitorOptions) {
    return new Promise((resolve, reject) => {
        if(!config || !Object.keys(config).length) return reject('未传入初始化参数')
        this.config = config;
        const debug = getObjectValue(config, 'debug')
        // 验证mode
        if(typeof debug === 'boolean') {
            this.debug = debug
        } else {
            this.debug = true
            this.debugLogMsg('SDK默认采用debug模式')
        }
        const jsError = getObjectValueByPath(config, 'config.jsError');
        jsError !== undefined && (this.watchJsError = !!jsError);
        const userOnline = getObjectValueByPath(config, 'config.userOnline');
        userOnline !== undefined && (this.watchJsError = !!userOnline);
        const performance = getObjectValueByPath(config, 'config.performance');
        performance !== undefined && (this.watchPerformance = !!performance);
        resolve(true)
    })
  }

  /**
   * SDK系统报错打印
   * @param args 
   */
  errorLogMsg(...args: any[]) {
    console.log('%cSDK Error:%c '+args.join(' '), 'background: red;color: white;', '')
  }

  /**
   * SDK系统Debug日志
   * @param args 
   */
  debugLogMsg(...args: any[]) {
    if(this.debug) console.log('%cSDK Debug:%c '+args.join(' '), 'background: blue;color: white;', '')
  }
}

const monitorSdk = new Monitor();
(window as any).monitorSdk = monitorSdk

export default monitorSdk