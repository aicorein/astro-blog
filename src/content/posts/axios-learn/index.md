---
title: "axios 学习笔记"
published: 2022-05-05
description: "Axios，基于 promise 封装的 HTTP 库"
tags: ["promise", "axios", "javascript", "ajax", "nodejs"]
category: "computer-science"
pinned: false
image: "https://miku.top/[dyn-img]"
licenseName: "CC BY-SA 4.0"
author: "律回"
draft: false
---

# axios 笔记



## 一、axios 概述、配置

主要功能：

- 浏览器端发送 AJAX 请求
- Node.js 支持下发送 HTTP 请求
- 支持 Promise API
- 请求和响应拦截
- 请求和响应的转发
- 取消请求
- 客户端防御 XSRF

配置：

```html
<script src="https://cdn.bootcdn.net/ajax/libs/axios/0.27.2/axios.min.js"></script>
```

```bash
npm install axios
```


---
## 二、axios 基本使用

```js
!function Action() {
    axios({
        method: 'xxx',	// 方法类型
        url: 'xxx',
        // 请求体，如果需要的话
        data: {
            a: xxx,
            b: xxx,
        },
    }).then(resp => {
        console.log(resp);
    })
}();
```


---
## 三、axios 其他请求方法

```js
axios.request(config);
axios.post(url, [data], [config]);
...
```

​	更多见于官方文档。


---
## 四、axios 响应结果结构

```js
{
    config: ...,	// axios 配置
    data: ...,		// 响应数据
    headers: ...,	// 响应头
    request: ...,	// 原生 AJAX 实例
    status: xxx,
    statusText: "xxx",
}
```


---
## 五、axios config 对象

​	`config` 对象体常用值如下：

```js
{
    url: 'xxx',
    method: 'xxx',
    baseURL: 'xxx',		// axios 会将它与 URL 自动拼接
    // 下面两个都是做预处理
    transformRequest: [function (data, headers) {
        ...
        return data;
    }],
    transformResponse: [function(data) {
        ...
        return data;
    }],
    headers: {xxx},
    params: {xxx},
    data: {xxx},	// 或这样：data: 'Country=Brasil&City=Belo Horizonte',
    timeout: xxx,
}
```


---
## 六、axios 默认设置

​	方法：

```js
axios.defaults.method = 'GET';
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.params = {id: 300};
axios.defaults.timeout = 3000;

axios({
    url: '/posts',
}).then(resp => {
    console.log(resp);
})
```


---
## 七、axios 创建实例对象发送请求

```js
// 实例化
const obj = axios.create({
    baseURL: 'https://api.apiopen.top',
    timeout: 2000
});
// 调用方法，也可以直接 obj(config)，使用与 axios 对象是很类似的
obj.get('/getJoke').then(resp => {
    console.log(resp);
});
```

​	注：创建实例对象的好处是，可以**给几类不同的请求指定不同的默认配置**。而不是使用上面的全局默认配置。


---
## 八、拦截器

​	简单来说，就是函数。可以在请求或响应前拦截进行检测。（也就是实现一些预处理）

```js
// 请求拦截器
axios.interceptors.request.use(config => {
    // 这里的 config 就是 config 对象
    console.log('请求拦截器 成功');
    return config;
}, err => {
    console.log('请求拦截器 失败');
    return Promise.reject(err);
});
// 响应拦截器
axios.interceptors.response.use(resp => {
    console.log('响应拦截器 成功');
    return resp;
}, err => {
    console.log('响应拦截器 失败');
    return Promise.reject(err);
})

// 具体的某个请求
axios.get('https://example.com/api/get').then(resp => {
    console.log(resp);
}).catch(err => {
    console.warn(err);
})
```

​	提示：

- 请求拦截器可以用于检查并修改配置
- 响应拦截器可以用于对原生的 axios 响应对象进行过滤
- 其中任何一个地方抛出错误或出现问题，都会按以下链传递：`请求拦截器` -> `响应拦截器` -> `请求的自定义 catch`


---
## 九、axios 取消请求

​	一个例子：（发送请求前先进行检查，若有，则取消重发）

```js
var cancel = null;

sendBtn.onclick = function() {
    // 判断是否有未完成请求
    if (cancel !== null) {
        cancel();
    }
    axios({
        method: 'GET',
        url: 'http://localhost:3000/posts',
        // 添加 cancelToken 配置项
        cancelToken: new axios.CancelToken(c => {
        	// 将 c 的值赋给 cancel
            cancel = c;
    	})
    }).then(resp => {
        console.log(resp);
        // 请求完成，重置
        cancel = null;
    })
}

cancelBtn.onclick = function() {
    cancel();
}
```


---
## 十、多个并发请求（弃用）

​	例子：

```js
function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

// 参数为所有 axios 请求函数的数组
axios.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread(function (acct, perms) {
    // 两个请求现在都执行完成
  }));
```

​	注：现推荐使用 `Promise.all()` 替代以上方法。