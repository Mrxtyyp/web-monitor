import monitorSdk from '..';
import report from '../utils/report';

// 兼容判断
const supported = {
  performance: !!window.performance,
  getEntriesByType: !!(window.performance && performance.getEntriesByType),
  PerformanceObserver: 'PerformanceObserver' in window,
  MutationObserver: 'MutationObserver' in window,
  PerformanceNavigationTiming: 'PerformanceNavigationTiming' in window,
};

/**
 * 初始化性能监听
 */
function initPerformance() {
  monitorSdk.debugLogMsg('SDK Debug: 初始化性能监听');
  if (document.readyState === 'complete') {
    if (supported.performance) observeNavigationTiming()
  } else {
    window.addEventListener('load', function () {
      if (supported.performance) observeNavigationTiming()
    });
  }
}

function observeNavigationTiming() {
  let timing = performance.timing;
  if (supported.getEntriesByType) {
    // 优先采用新版API
    if (supported.PerformanceNavigationTiming) {
      const t = performance.getEntriesByType('navigation')[0];
      t && (timing = t.toJSON());
    }
  }

  const {
    fetchStart,
    connectStart,
    connectEnd,
    requestStart,
    responseStart,
    responseEnd,
    domInteractive,
    domainLookupEnd,
    domContentLoadedEventStart,
    domContentLoadedEventEnd,
    loadEventStart,
  } = timing;

  report.send(normalizePerformance({
    kind: 'experience', // 用户体验指标
    type: 'timing', // 统计每个阶段的时间
    connectTime: connectEnd - connectStart, // TCP连接耗时
    dnsTime: domainLookupEnd - fetchStart, // dns耗时
    ttfbTime: responseStart - requestStart, // 首字节到达时间
    responseTime: responseEnd - responseStart, // response响应耗时
    parseDOMTime: domInteractive - responseEnd, // DOM解析渲染的时间
    domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart, // DOMContentLoaded事件回调耗时
    timeToInteractive: domInteractive - fetchStart, // 首次可交互时间
    loadTime: loadEventStart - fetchStart, // 完整的加载时间
  }));
}

/**
 * 格式化性能记录,小数位数保留最多两位,等于0的字段不传输,标记为undefined
 */
 function normalizePerformance(e: Record<string, any>) {
    Object.keys(e).forEach((p) => {
      const v = e[p];
      if (typeof v === 'number') e[p] = v === 0 ? 0 : parseFloat(v.toFixed(2));
    });
    return e;
  }

export default initPerformance;
