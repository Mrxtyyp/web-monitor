import { ReportErrorData } from '../types/index';
import getLastEventEle from './getEventEle';
import getSelector from './getSelector';

function getLines(stack: string) {
  return stack
    .split('\n')
    .slice(1)
    .map(item => item.replace(/^\s+at\s+/g, ''))
    .join('^');
}

export const parseJsError = (event: ErrorEvent): ReportErrorData => {
  let lastEvent = getLastEventEle(); // 获取到最后一个交互事件
  return {
    errorType: 'jsError', // js执行错误
    message: event.message, // 报错信息
    filename: event.filename, // 哪个文件报错了
    position: `${event.lineno}:${event.colno}`, // 报错的行列位置
    stack: getLines(event.error.stack),
    selector: lastEvent ? getSelector(lastEvent.path) : '', // 代表最后一个操作的元素
  };
};

export const parseSourceError = (event: ErrorEvent): ReportErrorData => {
  const target = event.target as HTMLScriptElement & HTMLLinkElement;
  return {
    errorType: 'resourceError', // js执行错误
    filename: target.src || target.href, // 哪个文件报错了
    tagName: target.tagName,
    selector: getSelector(event.target), // 代表最后一个操作的元素
  };
};

export const parsePromiseError = (event: PromiseRejectionEvent): ReportErrorData => {
  const lastEvent = getLastEventEle();
  let message;
  let filename;
  let line = 0;
  let column = 0;
  let stack = '';
  let reason = event.reason;
  if (typeof reason === 'string') {
    message = reason;
  } else if (typeof reason === 'object') {
    message = reason.message;
    if (reason.stack) {
      let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
      filename = matchResult[1];
      line = matchResult[2];
      column = matchResult[3];
    }
    stack = getLines(reason.stack);
  }
  return {
    errorType: 'promiseError', // js执行错误
    message, // 报错信息
    filename, // 哪个文件报错了
    position: `${line}:${column}`, // 报错的行列位置
    stack,
    selector: lastEvent.path ? getSelector(lastEvent.path) : '', // 代表最后一个操作的元素
  };
};
