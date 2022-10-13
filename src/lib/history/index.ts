import monitorSdk from '../..';
import report from '../../utils/report';

let oldURL = window.location.href; // 最后一次的url
let historyLength = window.history.length; // 最后一次history栈的长度

type PageViewData = {
  url?: string;
  referer?: string;
  actions?: string;
};

/**
 * 发送数据
 * @param option 请求参数
 */
function tracePageView(option?: PageViewData) {
  const { url = window.location.href, referer = oldURL, actions = '' } = option || {};
  let action = actions;
  if (!action && window.history.length < 50) {
    action = historyLength === window.history.length ? 'back_forward' : 'navigation';
    historyLength = window.history.length;
  }
  setTimeout(
    () => {
      report.send({
        kind: 'experience',
        type: 'pv',
        referer,
        action,
      });
    },
    document.title ? 0 : 17
  );
  oldURL = url;
  historyLength = window.history.length;
}
7;

/**
 * 路由Pv采集
 * pvHashtag 是否监听hash变化
 */
function initHistory(pvHash = true) {
    monitorSdk.debugLogMsg('初始化pv监听')
    pvHash && monitorSdk.debugLogMsg('初始化pv hash监听')
  const referer = document.referrer; // 获取是从哪个页面跳转来的

  let lastIsPopState = false; // 最后一次触发路由变化是否为popState触发
  tracePageView({ url: oldURL, referer });

  if (window.history.pushState) {
    // 劫持history.pushState history.replaceState
    const push = window.history.pushState.bind(window.history);
    window.history.pushState = (data, title, url) => {
      lastIsPopState = false;
      const result = push(data, title, url);
      tracePageView({ actions: 'navigation' });
      return result;
    };

    const repalce = window.history.replaceState.bind(window.history);
    window.history.replaceState = (data, title, url) => {
      lastIsPopState = false;
      const result = repalce(data, title, url);
      tracePageView({ actions: 'navigation' });
      return result;
    };

    // hash变化也会触发popstate事件,而且会先触发popstate事件
    // 可以使用popstate来代替hashchange,如果支持History H5 Api
    window.addEventListener('popstate', () => {
      if (window.location.hash !== '') {
        const oldHost =
          oldURL.indexOf('#') > 0 // 多页面情况下 history模式刷新还是在pv页面
            ? oldURL.slice(0, oldURL.indexOf('#'))
            : oldURL;
        if (window.location.href.slice(0, window.location.href.indexOf('#')) === oldHost && !pvHash)
          return;
      }
      lastIsPopState = true;
      tracePageView();
    });
  }
  // 监听hashchange
  window.addEventListener('hashchange', () => {
    monitorSdk.debugLogMsg('pv hash change');
    if (pvHash && !lastIsPopState) tracePageView();
    lastIsPopState = false;
  });
}

export default initHistory;
