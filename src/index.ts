import { MonitorMode, MonitorOptions } from './types/index';
import { getObjectValue } from './utils/common';
import initJsMonitor from './monitor/index';

class Monitor {
  public watchPerformance: boolean;
  public watchUserOnline: boolean;
  public watchJsError: boolean;
  public mode: MonitorMode;
  public config: object;
  constructor() {
    // 当前SDK的模式
    this.mode = 'test';
    // 是否监控JS错误
    this.watchJsError = true;
    // 是否监控用户在线时长
    this.watchUserOnline = true;
    // 是否监控性能指标
    this.watchPerformance = true;
    // 初始化配置
    this.config = Object.create(null);
  }

  init(config: MonitorOptions) {
    if(!config) return this.errorLogMsg('Error: 未传入初始化参数')
    this.config = config;
    const mode = getObjectValue(config, 'mode')
    // 验证mode
    if(mode && ['test', 'release'].includes(mode)) {
        this.mode = mode
    } else {
        this.testLogMsg('Waring: mode异常，只能为test或者release，默认采用test模式')
    }

    // 初始化JS监听
    // 初始化Promise
    // 初始化资源加载监听
    initJsMonitor()

    // 性能监听
    
  }

  errorLogMsg(...args: any[]) {
    console.error(...args)
  }

  testLogMsg(...args: any[]) {
    if(this.mode === 'test') console.log(...args)
  }
}

const monitorSdk = new Monitor();
(window as any).monitorSdk = monitorSdk

export default monitorSdk