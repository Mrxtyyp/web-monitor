import monitorSdk from '../..';
import report from '../../utils/report';

// 用户在线时长统计
const OFFLINE_MILL = 15 * 60 * 1000; // 15分钟不操作认为不在线
const SEND_MILL = 5 * 1000; // 每5s打点一次

let lastTime = Date.now();
/**
 * 初始化用户访问监听
 */
function initUV() {
  window.addEventListener(
    'click',
    () => {
      const now = Date.now();
      const duration = now - lastTime;
      if (duration > OFFLINE_MILL) {
        lastTime = Date.now();
      } else if (duration > SEND_MILL) {
        lastTime = Date.now();
        monitorSdk.debugLogMsg('发送用户留存时间埋点, 埋点内容 => ', { duration_ms: duration });
        // 用户在线时长
        report.send({
          kind: 'business',
          type: 'uv',
          duration,
        });
      }
    },
    false
  );
}

export default initUV;
