import monitorSdk from "../..";
import report from "../../utils/report";

export function initRequest() {
    monitorSdk.debugLogMsg('初始化Request监听')
    rewriteAjax()
    rewriteFetch()
}

const ajaxSend = XMLHttpRequest.prototype.send;
const ajaxOpen = XMLHttpRequest.prototype.open;

/**
 * 重写Ajax
 */
function rewriteAjax() {
    const _config = {
        src: '',
        method: '',
        duration: 0,
        triggerTime: 0
    };
  
    // 劫持 open方法
    XMLHttpRequest.prototype.open = function(method: string, url: string) {
      _config.method = method;
      _config.src = url as string;
      return ajaxOpen.call(this, method, url, true);
    };
  
    // 劫持 send方法
    XMLHttpRequest.prototype.send = function(body) {
      // body 就是post方法携带的参数
      let startTime = Date.now();

      this.addEventListener('readystatechange', () => {
        const {
          readyState,
          status,
          responseText,
          statusText
        } = this;
        if (readyState === 4) { // 请求已完成,且响应已就绪
          if (status < 200 || status >= 300) {
            report.send({
                kind: "stability",
                type: "request",
                errorType: 'ajax-'+_config.method,
                pathname: _config.src,
                status: status + "-" + statusText, // 状态码
                duration: Date.now() - startTime,
                response: responseText, // 响应体
                params: body ? JSON.stringify(body) : "", // 入参
            })
          }
        }
      });

      const handler = () => {
        report.send({
            kind: "stability",
            type: "request",
            errorType: 'ajax-'+_config.method,
            pathname: _config.src,
            status: this.status + "-" + this.statusText, // 状态码
            duration: Date.now() - startTime,
            response: this.response ? JSON.stringify(this.response) : "", // 响应体
            params: body ? JSON.stringify(body) : "", // 入参
        })
      }

      this.addEventListener("error", handler, false);
      this.addEventListener("abort", handler, false);
  
      return ajaxSend.call(this, body);
    };
}

const nativeFetch = window.fetch;
/**
 * 重写Fetch异常监控
 */
function rewriteFetch() {
    
    if (nativeFetch) {
      window.fetch = function traceFetch(target, options = {}) {
        const fetchStart = Date.now();
        const { method = 'GET' } = options;
        const result = nativeFetch(target, options);
        result.then((res) => {
          const { url, status, statusText } = res;
          if (status < 200 || status >= 300) {
            res.text().then(responseText => {
                report.send({
                    kind: "stability",
                    type: "request",
                    errorType: 'fetch-'+method,
                    pathname: url,
                    status: status + "-" + statusText, // 状态码
                    duration: Date.now() - fetchStart,
                    response: responseText, // 响应体
                    params: options.body || "", // 入参
                })
            })
            
          }
        }, (e) => {
          // 无法发起请求,连接失败
          report.send({
            kind: "stability",
            type: "request",
            errorType: 'fetch-'+method,
            pathname: target.toString(),
            status: '500-fetchError', // 状态码
            duration: Date.now() - fetchStart,
            response: e.message, // 响应体
            params: options.body || "", // 入参
        })
        });
        return result;
      };
    }
}

/**
 * 取消Request监听
 */
 export const cancelRequest = () => {
    monitorSdk.waringLogMsg('取消request监听器')
    window.fetch = nativeFetch;
    XMLHttpRequest.prototype.open = ajaxOpen;
    XMLHttpRequest.prototype.send = ajaxSend;
}