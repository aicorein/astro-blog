---
title: "AJAX 技术学习记录"
published: 2021-11-01
description: "AJAX —— 不刷新网页情况下的数据交互"
tags: [javascript, jquery, ajax]
category: computer-science
pinned: false
image: "https://miku.top/[dyn-img]"
licenseName: "CC BY-SA 4.0"
author: "律回"
draft: false
---

# AJAX 技术



## 一、原生 AJAX 技术

### 1、AJAX 简介

​	通过它可以在浏览器中向服务器发送异步请求，最大的优势：**无刷新获取数据**。



### 2、xml 标记语言

​	xml 早期是 AJAX 早期传输数据的一种格式，现在很多情况下已被 JSON 替代。



### 3、AJAX 的特点

​	（1）优点：

a. 无需刷新页面即可与服务端通信

b. 允许根据用户事件来更新网页内容

​	（2）缺点：

a. 没有浏览历史，无法回退

b. 存在跨域问题（要在同源下）

c. SEO 不友好



### 4、HTTP 请求与响应报文结构

​	下面主要讨论格式与参数。

​	HTTP 请求报文：

```text
行：请求类型 / 查询字符串 / HTTP 协议版本
头：host、cookie、user-agent...
<空行>
体：（当为 POST 请求时，请求体不能为空）
```

​	HTTP 响应报文：

```text
行：HTTP/1.1   200   OK
头：content-type、content-length...
<空行>
体：示例：（<html>...</html>）
```


### 3、一些测试辅助框架的安装和使用

​	在工作目录下：

```bash
# express 框架可提供服务端环境
npm init --yes
npm i exprees
# 使用：
node [服务端路由文件].js

# nodemon 框架可提供 node 脚本的实时刷新重启
npm install g nodemon
# 使用：
nodemon [服务端路由文件].js
```

​	服务端路由文件:

```js
// 引入
const express = require('express');

// 创建应用对象
const app = express();

// 创建路由规则
// request 是对请求报文的封装
// response 是对响应报文的封装
app.get('/', (request, response) => {
    response.send('HELLO EXPRESS');
})

// 监听端口启动服务
app.listen(5000, () => {
    console.log('服务已经启动，运行在 5000 端口。')
})
```



### 4、AJAX 请求基本操作

```js
btn.onclick = function() {
    // 创建对象
    const xhr = new XMLHttpRequest();
    
    // 初始化，设置请求方法和 url
    xhr.open('GET', 'http://127.0.0.1:8000/server');
    xhr.send();
    
    // 事件绑定
    // readystate 是 xhr 对象中的属性，表示状态 0 1 2 3 4
    // 分别对应：
    
    /* 初始状态、
    open 调用完毕、
    send 方法调用完毕、
    服务端返回了部分结果
    服务端返回了所有结果 */
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                // 正常响应区间
                // handle...
            }
            else {
                // handle...
            }
        }
    }
}
```

​	以下是 `xhr` 对象常用的属性、方法：

```js
xhr.status						// 状态码
xhr.statusText					// 状态字符串
xhr.getAllResponseHeaders()		// 所有响应头
xhr.response					// 响应体
```



### 5、AJAX 设置请求参数

```js
var query = {
    a: 100,
    b: 200
}
var base_url = 'http://127.0.0.1:5000';

// 处理参数函数，拼接 url
var process_query = (url, query) => {
    url += '?';
	for (var k in query) {
    	url += k + '=' + query[k];
    	url += '&';
	}
    url = url.slice(0, url.length - 1);
    return url
}
var url = process_query(base_url, query);

xhr.open(url);
```



### 6、AJAX 发送 POST 请求

```js
xhr.open('POST', 'http://127.0.0.1:5000');

// 设置请求参数
var formdata = new formData();
formdata.append('a', '100');
formdata.append('b', '200');

xhr.send(formdata);
```



### 7、AJAX 设置请求头信息

```js
// 设置预定义的请求头
xhr.setRequestHeaders('Content-Type', 'application/x-www-form-urlencoded');

// 设置自定义的请求头
xhr.setRequestHeaders('name', 'AiCorein');
```



### 8、AJAX 服务端响应 JSON 数据

​	封装和解析：

```js
// Server:
...
const data = {
    name: 'melodyEcho';
}
let str = JSON.stringify(data);
response.send(str);
...

// Client:（手动转换方式）
...
let data = JSON.parse(xhr.response);
console.log(data);
...
```

```js
// 自动转换:
xhr.responseType = 'json';
let data = xhr.response;
```



### 9、AJAX-IE 缓存问题

```js
// 添加参数即可
xhr.open('GET', 'http://127.0.0.1' + Date.now());
```



### 10、AJAX 超时与网络异常处理

```js
// 设置超时时长
xhr.timeout = 2000;


// 设置超时回调
xhr.ontimeout = function() {
    // handle...


// 网络异常回调
xhr.onerror = function() {
    // handle...
}
```



### 11、AJAX 请求取消

```js
// 取消：
xhr.abort();
```



### 12、AJAX 请求重复发送问题

​	可以通过设置一个 "正在发送请求" 标志来避免请求的短时间重复发送。

```js
let isSending = false;
let xhr = null;

btns[0].onclick = function() {
    if (isSending) xhr.abort();
    xhr = new XMLHttpRequest();
    isSending = true;
    xhr.open(...);
    xhr.send(...);
    xhr.onreadystatechange = function() {
        if (xhr.readystate == 4) {
            isSending = false;
            ...
        }
    }
}
```



## 二、jQuery 发送 AJAX 请求

### 1、jQuery 发送 GET、POST 请求

```js
// get 方法
$.get('http://127.0.0.1:8000/get', {a: 100, b: 200}, function() {
    console.log(data);
})

// post 方法
$.get('http://127.0.0.1:8000/post', {a: 100, b: 200}, function() {
    console.log(data);
}, 'json');		// 指定返回数据类型
```

​	更多详细细节：[\$.get() 方法](https://www.runoob.com/jquery/ajax-get.html), [\$.post() 方法](https://www.runoob.com/jquery/ajax-post.html)



### 2、jQuery 发送请求通用方法

```js
$.ajax({
    url: 'http://127.0.0.1:8000/server',
    data: {a: 100, b: 200},
    type: 'GET',
    dataType: 'json',
    success: function(data) {
        console.log(data);
    },
    timeout: 2000,
    error: function() {
        console.log('Error');
    },
    // 注：自定义请求头需要 Server 端有对应的
    // Access-Control-Allow-Headers 策略
    headers: {
        c: 300,
        d: 400
    }
})
```
