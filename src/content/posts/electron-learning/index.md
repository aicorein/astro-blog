---
title: "Electron 学习笔记（常用功能记录）"
published: 2022-03-31
description: "Electron，使用 JS、H5C3 构建跨平台桌面应用"
tags: [electron, javascript, nodejs]
category: computer-science
permalink: "electron-learning"
pinned: false
image: "https://api.anosu.top/img/?sort=pc&size=mw1920"
licenseName: "CC BY-SA 4.0"
author: "律回"
draft: false
---

# Electron 学习笔记（常用功能记录）

## 一、简介

​	`Electron` = `Chromium` + `Node.js` + `Native API`


---
## 二、Hello World 示例

​	写好 `index.html` 后，写一个 `main.js` 作主进程：

```js
var electron = require('electron');

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({width: 800, height: 800});
    mainWindow.loadFile('index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    })
})
```


---
## 三、渲染进程和本地文件读取

​	渲染进程：

​	使用渲染进程，则初始化 `mainWindow` 时，需要添加一个参数：

```js
mainWindow = new BrowserWindow({
    width: 800, 
    height: 800,
    webPreferences: {nodeIntegration: true}
});
```

​	读取文件的渲染进程写法：

```js
var fs = require('fs');
window.onload = function() {
    fs.readFile('xxx.txt', (err, data) => {
        // action
    })
}
```


---
## 四、Remote 模块

​	使用 remote 模块可以让渲染进程使用主进程的方法，如新建页面。

​	先进行安装：

```bash
npm install --save @electron/remote
```

​	`main.js` 中：

```js
...
const remote = require('@electron/remote/main')
remote.initialize(); // 初始化
...

app.on('ready', () => {
    ...
    remote.enable(mainWindow.webContents);
})
```

​	`render.js` 中：

```js
const {BrowserWindow} = require("@electron/remote");

window.onload = function() {
    btn.onclick = () => {
        newWin = new BrowserWindow({
            width: 500,
            height: 500
        })
        newWin.on('closed', function() {
            newWin = null;
        })
    }
}
```


---
## 五、创建主菜单

​	新建一个 `menu.js`：

​	注：`menu.js` 的功能在主进程中完成，因此**不需要 remote**

```js
const { Menu } = require('electron');
var template = [
    {
        label: 'Outer Menu1',
        submenu: [
            {
                label: 'Inner Menu11',
                // 绑定快捷键
                accelerator: 'ctrl+n',
                // 绑定点击事件
                click: () => {
                    ...
                }
            },
            {label: 'Inner Menu12'},
        ]
    },
    {
        label: 'Outer Menu2',
        submenu: [
            {label: 'Inner Menu21'},
            {label: 'Inner Menu22'},
        ]
    }
]

var m = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(m);
```


---
## 六、创建右键菜单

​	在主 html 引用的 js 中绑定右键事件。

​	注：由于 html 属于渲染进程，因此此处**要使用 remote**

```js
// 引用 js 中：
const { BrowserWindow, Menu, getCurrentWindow } = require("@electron/remote");

...
//固定写法：
var rightMenuTemplate = [
    {label: '复制', accelerator: 'ctrl+c'},
    {label: '粘贴', accelerator: 'ctrl+v'},
]

var m = Menu.buildFromTemplate(rightMenuTemplate);
window.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    m.popup({window: getCurrentWindow()});
})
```


---
## 七、通过链接打开浏览器

​	使用 shell 可以完成该需求。

​	对应 js 中：

```js
const { shell } = require('electron');

var theLink = document.querySelector('#website');
theLink.onclick = function(e) {
    e.preventDefault();
    shell.openExternal(this.getAttribute('href'));
}
```


---
## 八、嵌入网页与打开子窗口

​	嵌入网页（在 `main.js`）：

```js
const { BrowserView } = require('electron');

// 以 BrowserView 形式嵌入子网页
var view = new BrowserView();
mainWindow.setBrowserView(view);
view.setBounds({ x: 0, y: 100, width: 700, height: 500 });
view.webContents.loadURL('https://example.com');
```

​	传统 html 打开新窗口：

```js
// 打开新窗口
var theLink = document.querySelector('#website');

var linkBtn = document.querySelector('#website-tab');
linkBtn.onclick = function() {
    window.open(theLink.getAttribute('href'));
}
```


---
## 九、父子窗口通信

​	这里涉及的都是传统的 js 方法

​	特别注意：使用 `window.open()` 创建的子窗口**方法受限**，无法使用诸如 `openDevtools()` 等功能。

​	子窗口 js：

```js
var popbtn = window.document.querySelector('#popbtn');
popbtn.onclick = function(e) {
    window.opener.postMessage('这是一条来自子窗口的信息');
}
```

​	父窗口 js：

```js
window.addEventListener('message', (msg) => {
    let mytext = document.querySelector('#mytext');
    // 注意 msg 是一个 json 对象
    mytext.innerHTML = JSON.stringify(msg.data);
})
```


---
## 十、选择文件对话框

​	使用 `dialog.showOpenDialog()` 方法来实现。有两个参数，一个是基本属性，一个是回调。

​	注意：这里的对话框并不会提供文件载入功能，只是让用户确定打开的文件路径。

​	基本参数有：

- title
- defaultPath
- buttonLabel
- filters
- properties（打开文件的属性）

```js
// 渲染进程中使用：
const { dialog } = require('@electron/remote');

fileBtn.onclick = function() {
    dialog.showOpenDialog({
        // 参数列表
        title: '选择存档~',
        defaultPath: 'desktop',
        filters:[
            {name: 'img', extensions:['jpg', 'png', 'gif']},
            {name: 'text file', extensions:['c', 'cpp', 'py', 'txt', 'config']},
        ],
        buttonLabel: '载入存档'
    }).then(result => {
        // 打开之后的操作
        console.log(result);
        ...
    }).catch(err => {
        // 异常处理
        console.error(err);
    })
}
```


---
## 十一、保存文件对话框

​	使用 `showSaveDialog()` 方法，与 `showOpenDialog()` 用法基本一致。

​	特别注意：触发对话框的元素**最好不要被遮挡**，否则可能会出现不可预知的崩溃！

​	保存文件可搭配 fs 模块使用。

```js
const fs = require('fs');
fs.writeFileSync(path, string);
```


---
## 十二、消息对话框操作

​	使用 `showMessageBox` 方法。

​	参数：

- type：有 warning、info、question 和 error
- title：标题
- message：消息内容
- buttons：提供的选项（字符串列表）

```js
const { dialog } = require('@electron/remote');

infoBtn.onclick = function() {
    dialog.showMessageBox({
        type: 'info',
        title: '信息。',
        message: '只是一条提示信息。',
        buttons: ['哦？', '啊这...'],
    }).then(result => {
        console.log(result)
    }).catch(err => {
        console.error(err);
    })
}
```


---
## 十三、断网提醒功能

​	原生 html 事件监听实现实现。

```js
window.addEventListener('online', function() {
    alert('又有网络了，好耶！');
})
window.addEventListener('offline', function() {
    alert('好像断线了哦...');
})
```


---
## 十四、底部消息通知

​	原生 html 方法。

```js
var notifyBtn = document.querySelector('#notify-btn');
var option = {
    title: '这是通知的标题',
    body: '这是通知的内容',
};
notifyBtn.onclick = function() {
    new window.Notification(option.title, option);
}
```


---
## 十五、注册全局快捷键

​	写在主进程中。

```js
const { globalShortcut } = require('electron');

app.whenReady().then(() => {
    ...
	// 全局快捷键
    globalShortcut.register('ctrl+g+l', function() {
        view.webContents.loadURL('https://bilibili.com');
    })
    // 检测是否注册成功
    let isReisterMsg = globalShortcut.isRegistered('ctrl+g+l')?true:false;
    console.log(isReisterMsg);
    ...
})

// 注销全局快捷键
app.on('will-quit', () => {
    globalShortcut.unregister('ctrl+g+l');
    globalShortcut.unregisterAll();
})
```


---
## 十六、剪贴板功能

​	使用 clipboard 模块的 `writeText()` 方法。

```js
const { clipboard } = require('electron');

var copyBtn = document.querySelector('#copy-btn');
// 除 writetext，也可以用其他方法实现复制图片等操作
copyBtn.onclick = function() {
    clipboard.writeText('这是你复制的文本！~');
    alert('复制成功！');
}
```

