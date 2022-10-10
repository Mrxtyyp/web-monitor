
// ----- ajax请求错误 ---- 

var fetchError = document.getElementsByClassName("err-fetch-request")[0];
fetchError.onclick = function () {
    fetch('/fetchError')
}

// ajax请求错误
var ajaxRequestError = document.getElementsByClassName("err-ajax-request")[0];
ajaxRequestError.onclick = function () {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.timeout = 3000;
  xhr.open("get", '/ajaxerror?p=1&t=2', true);
  xhr.setRequestHeader("content-type", "application/json;charset=utf-8");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send();
}

// server 500 error
var servererrAjax = document.getElementsByClassName("servererr-ajax-request")[0];
servererrAjax.onclick = function () {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.timeout = 3000;
  xhr.open("post", '/servererr', true);
  xhr.setRequestHeader("content-type", "application/json;charset=utf-8");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send({a: 1, b: 2});
}

// ajax失败
var ajaxFailed = document.getElementsByClassName("fail-ajax-request")[0];
ajaxFailed.onclick = function () {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.timeout = 3000;
  xhr.open("get", '/servererr', true);
  xhr.setRequestHeader("content-type", "application/json;charset=utf-8");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send();
}

// ajax请求超时
var ajaxTimeout = document.getElementsByClassName("timeout-ajax-request")[0];
ajaxTimeout.onclick = function () {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.timeout = 3000;
  xhr.open("get", '/timeout', true);
  xhr.setRequestHeader("content-type", "application/json;charset=utf-8");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send();
}


// ----- js 执行错误 ----

// js 执行错误
var jsRunningerror = document.getElementsByClassName("js-running-error")[0];
jsRunningerror.onclick = function () {
  jsRunningerrorssss;
}

// Promise 错误
var promiseError = document.getElementsByClassName("promise-error")[0];
promiseError.onclick = function () {
  new Promise((resolve, reject) => {
    reject();
  })
}


// ----- 资源加载异常 ---- 

// js
var jsload = document.getElementsByClassName("err-js-load")[0];
jsload.onclick = function () {
  var script = document.createElement("script");
  script.src = `./js/undefied.js`;
  document.body.appendChild(script);
}

var cssload = document.getElementsByClassName("err-css-load")[0];
cssload.onclick = function () {
  var css = document.createElement("link");
  css.type = `text/css`;
  css.rel = 'stylesheet';
  css.href = `./js/undefied.css`;
  document.head.appendChild(css);
}

var imageload = document.getElementsByClassName("err-image-load")[0];
imageload.onclick = function () {
  var img = document.createElement("img");
  img.src = `./js/undefied.png`;
  document.body.appendChild(img);
}

var iframeload = document.getElementsByClassName("err-iframe-load")[0];
iframeload.onclick = function () {
  var iframe = document.createElement("iframe");
  iframe.src = `http://47.109.52.30:8082/v1/sys/config`;
  document.body.appendChild(iframe);
}


// ------ 第三方资源错误 ------
var resourceError = document.getElementsByClassName("other-resource-error")[0];
resourceError.onclick = function () {
  var test = document.getElementsByClassName("other-resource-error111")[0];
  test.onclick= function() {};
}

// ------ 销毁实例 ------
var destory = document.getElementsByClassName("destory")[0];
destory.onclick = function () {
  window.monitorSdk.destory();
}
