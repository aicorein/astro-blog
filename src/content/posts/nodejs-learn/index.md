---
title: "Node.js 学习笔记"
published: 2022-05-12
description: "Node.js —— 让 JavaScript 成为与等服务端语言平起平坐的脚本语言"
tags: ["cros", "express", "npm", "javascript", "session", "jwt", "nodejs"]
category: "computer-science"
permalink: "nodejs-learn"
pinned: false
image: "https://api.anosu.top/img/?sort=pc&size=mw1920"
licenseName: "CC BY-SA 4.0"
author: "律回"
draft: false
---

# Node.js 笔记



## 一、Node.js 初识与内置模块

### 1、初识

#### （1）简介

​	Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。



#### （2）Node.js 中的 JS 运行环境

![image-20220508101054872](images/image-20220508101054872.webp)

​	注：

- 浏览器是 JavaScript 的前端运行环境。
- Node.js 是 JavaScript 的后端运行环境。
- Node.js 中**无法调用 DOM 和 BOM 等浏览器内置 API**。



#### （3）环境安装

​	网址：[Node.js 官网](https://nodejs.org/en)



#### （4）node 环境执行 JS
​	执行命令：

 ```bash
 node xxx.js
 ```

---
### 2、fs 文件系统模块

​	fs 模块是 Node.js 官方提供的、用来操作文件的模块。它提供了一系列的方法和属性，用来满足用户对文件的操作需求。

​	`fs.readFile())` 方法，用来读取指定文件中的内容。

​	`fs.writeFile() `方法，用来向指定的文件中写入内容。



#### （1）读取文件

```js
const fs = require('fs')
fs.readFile('./test.txt', 'utf-8', (err, dataStr) => {
    // 失败结果
    console.log(err)
    consloe.log('-----')
    // 读取的结果
    console.log('dataStr')
})
```

​	注：如果读取失败，err 为错误对象，dataStr 为 undefined。



#### （2）写入文件

 ```js
 const fs = require('fs')
 fs.writeFile('./test.txt', 'Hello Node.js!', 'utf-8', err => {
     // 如果写入成功，err 为 null
     console.log(err)
 })
 ```

​	注：写入失败，err 为错误对象。



#### （3）路径动态拼接问题

​	node 运行的 js 中拼接相对路径时，会以执行 node 的目录为基准，而不是被执行的 js 目录为准。

​	可以使用 `__dirname` 来指定路径，它指向当前 js 文件所处目录。

​	那么这样解决拼接问题即可：

```js
path = __dirname + './test.txt';
```

​	注：这里是为了演示，实际使用中更推荐使用 `path.join() `方法。


---
### 3、path 路径模块

​	path 模块是 Nodejs 官方提供的、用来处理路径的模块。它提供了一系列的方法和属性，用来满足用户对路径的处理需求。

​	`path.join() `方法，用来将多个路径片段拼接成一个完整的路径字符串。

​	`path.basename()` 方法，用来从路径字符串中，将文件名解析出来。



#### （1）路径拼接

​	使用 `path.join` 方法可以将**多个路径片段**拼接成完整的路径字符串。

```js
const pathStr = path.join('/a', '/b/c', '../', './d', 'e');
console.log(pathStr);

const pathStr2 = path.join(__dirname, './files/1.txt');
console.log(pathStr2);
```



#### （2）获取路径中文件名

​	使用 `path.basename` 方法可以从一个文件路径中提取文件名

```js
const path = require('path');

const fpath = 'a/b/c/index.html'
var fullName = path.basename(fpath);
console.log(fullName)	// output: index.html

var nameWithoutExt = path.basename(fpath, '.html');
console.log(nameWithoutExt);	// output: index
```



#### （3）获取路径中文件扩展名

```js
const path = require('path');

const fext = path.extname(fpath);
console.log(fext);	// 输出 .html
```


---
### 4、http 模块

​	http 模块是Node.js 官方提供的、用来创 web 服务器的模块。通过 http 模块提供的 `http.createServer() ` 方法，就能方便的把一台普通的电脑，变成一台 Web 服务器，从而对外提供 Web 资源服务。



#### （1）创建基本的 web 服务器

- 导入 http 模块
- 创建 web 服务器实例
- 为服务器实例绑定 request 事件，监听客户端请求
- 启动服务器

```js
const http = require('http')

const server = http.createServer()
server.on('request', (req, res) => {
    console.log('Someone visit the web server.')
})

server.listen(80, () => {
    console.log('Server runnnig at http://127.0.0.1:80')
})
```



#### （2）req 请求对象与 res 响应对象

​	只要服务器接收到了客户端的请求，就会调用通过 `server.on()` 为服务器绑定的 request 事件处理函数。
​	如果想在事件处理函数中，访问与客户端相关的数据或属性，可以使用如下的方式：

```js
server.on('request', (req) => {
    const url = req.url;
    const method = req.method;
    const str = `The request url is ${url}, the method is ${method}`
    console.log(str);
})
```

​	在服务器的 request 事件处理函数中，如果想访问与服务器相关的数据或属性，可以使用如下的方式：

```js
server.on('request', (req, res) => {
    const str = `你请求的地址是：${req.url}, 方法是：${req.method}`
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(str)
})
```



---



## 二、模块化

### 1、Node.js 中的模块化

#### （1）分类

​	分为三大类：

- 内置模块（内置模块是由 Node.js 官方提供的，例如 fs、path、http 等）
- 自定义模块（用户创建的每个 js 文件，都是自定义模块）
- 第三方模块（由第三方开发出来的模块，并非官方提供的内置模块，也不是用户创建的自定义模块，使用前需要先下载）



#### （2）加载模块

​	使用强大的 `require()` 方法，可以加载需要的内置模块、用户自定义模块、第三方模块进行使用。

```js
const fs = require('fs')
const custom = require('./custom.js')	// 可以省略 js 后缀名
const electron = require('electron')
```

​	使用 `require()` 方法加载其它模块时，会执行被加载模块中的代码。



#### （3）模块作用域

​	和函数作用域类似，在自定义模块中定义的变量、方法等成员，**只能在当前模块内被访问**，这种模块级别的访问限制，叫做模块作用域。

​	如：

```js
// 1.js 中：
const username = 'MelodyEcho'

// 2.js 中：
const custom = require('./1.js')
console.log(custom);	// 会发现打印出来是空对象
```

​	模块作用域：

- 可以防止全局变量污染



#### （4）向外共享模块作用域的成员

​	**module 对象**：在每个js自定义模块中都有一个module对象，它里面存储了和当前模块有关的信息。

​	结构如下：

```js
Module {
  id: '.',
  path: 'c:\\Users\\15742\\Desktop\\Front-end(new)\\Node.js\\code',
  exports: {},
  filename: 'c:\\Users\\15742\\Desktop\\Front-end(new)\\Node.js\\code\\test.js',
  loaded: false,
  children: [],
  paths: [
    'c:\\Users\\15742\\Desktop\\Front-end(new)\\Node.js\\code\\node_modules',
    'c:\\Users\\15742\\Desktop\\Front-end(new)\\Node.js\\node_modules',
    'c:\\Users\\15742\\Desktop\\Front-end(new)\\node_modules',
    'c:\\Users\\15742\\Desktop\\node_modules',
    'c:\\Users\\15742\\node_modules',
    'c:\\Users\\node_modules',
    'c:\\node_modules'
  ]
}
```

​	

​	**module.exports 对象**：在自定义模块中，可以使用 module.exports 对象，将模块内的成员共享出去，供外界使用。外界用 `require()` 方法导入自定义模块时，得到的就是 module.exports 所指向的对象。它默认是为空的。

​	示例：

```js
// 1.js 中：
module.exports.username = 'MelodyEcho'
module.exports.echo = function(melody) {
    console.log(`Melody ${melody} has been echoed.`)
}
const age = 18
module.exports.age = age;

// 2.js 中：
const m = require('./1.js')
console.log(m);		
// 输出：{ username: 'MelodyEcho', echo: [Function (anonymous)], age: 18 }
```

​	注：模块导入的结果，**永远以 module.exports 指向的对象为准**。

​	由于 module.exports 单词写起来比较复杂，为了简化向外共享成员的代码，Node 提供了 exports 对象。默认情况下，exports 和 module.exports 指向同一个对象。最终共享的结果，还是以 module.exports 指向的对象为准。

```js
console.log(exports === module.exports)		// True
```

​	一些使用案例的结果：（原理是 JS 引用机制，这里不再赘述）

![image-20220508211641439](images/image-20220508211641439.webp)

![image-20220508211654345](images/image-20220508211654345.webp)

​	**总结**：为了防止混乱，最好不要在同一个模块中同时使用 exports 和 module.exports 。



#### （5）模块化规范

​	Nodejs 遵循了 CommonJS 模块化规范，CommonJS 规定了模块的特性和各模块之间如何相互依赖。

- 每个模块内部，module 变量代表当前模块。
- module 变量是一个对象，它的 exports 属性（即 module.exports ）是对外的接口。
- 加载某个模块，其实是加载该模块的 module.exports 属性。`require()` 方法用于加载模块。

---

### 2、npm 与包

#### （1）包

​	**简介**：Node.js 中的第三方模块又叫做包。包是基于内置模块封装出来的，提供了更高级、更方便的APl，极大的提高了开发效率。

​	**来源**：不同于 Node.js 中的内置模块与自定义模块，包是由第三方个人或团队开发出来的，免费供所有人使用。Node.js 中的包都是免费且开源的，不需要付费即可免费下载使用。

​	搜索包：https://www.npmjs.com/

​	下载包（使用 npm 工具）：https://registry-mpmis.org/



#### （2）npm 使用

​	安装命令：

```bash
npm install 包1 [包2]
npm i 包1 [包2]
```

​	卸载命令：

```bash
npm uninstall 包名
```



​	文件分析：初次装包完成后，在项目文件夹下多一个叫做 node_modules 的文件夹和 package-lock.json 的配置文件。

- node_modules 文件夹用来存放所有已安装到项目中的包。`require()` 导入第三方包时，就是从这个目录中查找并加载包。
- package-lock.json 配置文件用来记录 node_modules 目录下的每一个包的下载信息，例如包的名字、版本号、下载地址等。
- 特别注意，如果当前目录上级目录中有 package.json 文件，那么就**不会在当前目录添加包，而是在那一层上级目录。**



​	安装指定版本包：默认情况下，使用npm install命令安装包的时候，会自动安装最新版本的包。如果需要安装指定版本的包，可以在包名之后，通过@符号指定具体的版本，例如：

```bash
npm i moment@2.22.2
```



#### （3）npm 包的语义化版本规范

​	包的版本号是以"点分十进制"形式进行定义的，总共有三位数字，例如 2.24.0。
​	其中每一位数字所代表的的含义如下：

- 第1位数字：大版本
- 第2位数字：功能版本
- 第3位数字：Bug修复版本

​	规则：只要前面的版本号增长了，则后面的版本号归零。



#### （4）npm 包管理配置文件

​	npm 规定，在项目根目录中，**必须提供**一个叫做 package.json 的包管理配置文件。用来记录与项目有关的一些配置信息。例如：

- 项目的名称、版本号、描述等
- 项目中都用到了哪些包
- 哪些包只在开发期间会用到
- 那些包在开发和部署时都需要用到

​	

​	快速在当前目录下创建 package.json：

```bash
npm init -y
```

- 目录路径不要有中文和空格
- 只需要运行一次，之后再进行安装时，npm 会自动更新该文件



​	**package.json 中的 dependencies 节点**：专门用来记录使用 npm install 命令安装了哪些包。



​	**一次性安装所有包**：

```bash
# 执行npm install 命令时，npm 包管理工具会先读取 package.json 中的dependencies 节点，读取到记录的所有依赖包名称和版本号之后，npm 包管理工具会把这些包一次性下载到项目中。
npm i
```



​	**package.json 中的 devDependencies 节点**：如果某些包只在项目开发阶段会用到，在项目上线之后不会用到，则建议把这些包记录到devDependencies节点中。与之对应的，如果某些包在开发和项目上线之后都需要用到，则建议把这些包记录到 dependencies 节点中。

```bash
# 安装指定的包，并记录到devDependencies节点中
npm i 包名 -D
# 注意：上述命令是简写形式，等价于下面完整的写法：
npm install包名--save-dev
```



#### （5）切换 npm 下载镜像源

```bash
# 查看当前下载源
npm config get registry
# 切换为淘宝镜像源
npm config set registry=https://registry.npm.taobao.org/
```



#### （6）nrm 工具

​	为了更方便的切换下包的镜像源，我们可以安装 nrm 这个小工具，利用 nrm 提供的终端命令，可以快速查看和切换下包的镜像源。

```bash
# 通过npm包管理器，将 nrm 安装为全局可用的工具
npm i nrm -g
# 查看所有可用的镜像源
nrm ls
# 将下包的镜像源切换为 taobao 镜像
nrm use taobao
```


---
### 3、包的分类与包发布

#### （1）项目包

​	那些被安装到项目的 node_modules 目录中的包，都是项目包。
​	项目包又分为两类，分别是：

- 开发依赖包（被记录到 devDependencies 节点中的包，只在开发期间会用到）
- 核心依赖包（被记录到 dependencies 节点中的包，在开发期间和项目上线之后都会用到）



#### （2）全局包

​	在执行 npm install 命令时，如果提供了-g 参数，则会把包安装为全局包。

​	默认安装位置为：`%AppData%/npm/node_modules`

​	注：只有工具性质的包，才有全局安装的必要性。因为它们提供了好用的终端命令。至于是否全局安装，可以参考官方说明。



#### （3）规范的包结构

​	在清楚了包的概念、以及如何下载和使用包之后，接下来，我们深入了解一下包的内部结构。

​	一个规范的包，它的组成结构，必须符合以下3点要求：

1. 包必须以**单独的目录**而存在
2. 包的顶级目录下要**必须包含 package.json** 这个包管理配置文件
3. package.json 中**必须包含 name，version，main 这三个属性**，分别代表包的名字、版本号、包的入口。

​	注：以上3点要求是一个规范的包结构必须遵守的格式，关于更多的约束，可以参考如下网址：
​	https://yarnpkg.com/zh-Hans/docs/package-json


---
### 4、模块的加载机制

#### （1）优先从缓存加载

​	模块在第一次加载后会被缓存。这也意味着多次调用 `require()` 不会导致模块的代码被执行多次。同时，内置模块、用户自定义模块、还是第三方模块，它们都会优先从缓存中加载，从而提高模块的加载效率。



#### （2）内置模块加载机制

​	内置模块是由 Node.js 官方提供的模块，同名时内置模块的加载优先级最高。



#### （3）自定义模块加载机制

​	使用 `require()` 加载自定义模块时，必须指定以 ./ 或 ../ 开头的路径标识符。在加载自定义模块时，如果没有指定 ./ 或 ../ 这样的路径标识符，node.js 会把它当作内置模块或第三方模块进行加载。

​	同时，在使用 `require()` 导入自定义模块时，如果省略了文件的扩展名，则 Node.js 会按顺序分别尝试加载以下的文件： 

1. 按照确切的文件名进行加载
2. 补全 js 扩展名进行加载
3. 补全 json 扩展名进行加载
4. 补全 node 扩展名进行加载
5. 加载失败，终端报错

​	如果传递给 `require()` 的模块标识符不是一个内置模块，也没有以 ./ 或 ../ 开头，则 Node.js 会从当前模块的父目录开始，尝试从 /node_modules 文件夹中加载第三方模块。

​	**如果没有找到对应的第三方模块，则移动到再上一层父目录中，进行加载，直到文件系统的根目录。**



#### （4）目录作为模块

​	当把目录作为模块标识符，传递给 `require()` 进行加载的时候，有三种加载方式：

- 在被加载的目录下查找一个叫做 package.json 的文件，并寻找 main 属性，作为 `require()` 加载的入口
- 如果目录里没有 package.json 文件，或者 main 入口不存在或无法解析，则 Node.js 将会试图加载目录下的 index.js 文件。
- 如果以上两步都失败了，则 Node.js 会在终端打印错误消息，报告模块的缺失：Error: Cannot find module 'xxx'



---

## 三、express 模块

### 1、初识 express

​	Express 的作用和 Node.js 内置的 http 模块类似，是专门用来创建 Web 服务器的。http 内置模块用起来很复杂，开发效率低；Express 是基于内置的 http 模块进一步封装出来的，能够极大的提高开发效率。

​	对前端开发者来说，使用 Express，我们可以方便、快速的创建 **Web 网站的服务器**或 **API 接口的服务器**。

---

### 2、基本使用

​	安装：

```bash
npm i express@4.17.1
```



​	创建基本的 web 服务器：

```js
// 导入 express
const express = require('express')
// 启动 web 服务器
const app = express()
// 启动 web 服务器
app.listen(80, () => {
    console.log('express server running at http://localhost')
})
```

​	监听 GET 和 POST 请求：

```js
// 参数1：客户端请求的URL地址
// 参数2：请求对应的处理函数
// req：请求对象（包含了与请求相关的属性与方法）
// res：响应对象（包含了与响应相关的属性与方法）
app.get('请求URL'，function(req, res) {...})
app.post('请求URL'，function(req, res) {...})
```

​	把内容响应给客户端：

```js
res.send({name: 'melodyecho', age: 18})
res.send('Hello World!')
```

​	获取 URL 中携带的查询参数（如无则为空对象）

```js
console.log(req.query);
```

​	获取 URL 中的动态参数值（如 /user/:id 或 /users/:id/:name）

```js
console.log(req.params);
```

---

### 3、托管静态资源

#### （1）托管单个资源目录

​	express 提供了一个非常好用的函数，叫做 `express.static()`，通过它，我们可以非常方便地创建一个静态资源服务器，例如，通过如下代码就可以将 public 目录下的图片、CSS 文件、JavaScript 文件对外开放访问了：

```js
app.use(express.static('public'))
// 比如 public 里有文件夹：images
// 那么访问路径： /images/bg.jpg
```

​	注：Express 在指定的静态目录中查找文件，并对外提供资源的访问路径。**因此，存放静态文件的目录名不会出现在 URL 中**。



#### （2）托管多个资源目录

​	多次调用 `express.use()` 方法即可，只是注意查找顺序是按书写顺序的。

```js
app.use(express.static('public'))
app.use(express.static('files'))
```

​	按 URL 区分：

```js
app.use('/users', express.static('./user-info'))
app.use('/', express.static('./assets'))
```

---

### 4、路由

​	其实就是映射关系。

​	在 Express 中，路由指的是客户端的请求与服务器处理函数之间的映射关系。Express 中的路由分 3 部分组成，分别是请求的类型、请求的 URL 地址、处理函数，格式如下：

```js
// app.METHOD(PATH, HANDLER)
app.get('/', function(req, res) => {
	res.send('Hello Wrold!')
})
```

#### （1）路由匹配过程

​	每当一个请求到达服务器之后，需要先经过路由的匹配，只有匹配成功之后，才会调用对应的处理函数。

​	在匹配时，会按照路由的顺序进行匹配，如果请求类型和请求的 URL 同时匹配成功，则 Express 会将这次请求，转交给对应的函数进行处理。



#### （2）模块化路由

​	为了方便对路由进行模块化的管理，Express 不建议将路由直接挂载到 app 上，而是推荐将路由抽离为单独的模块。

​	步骤：

- 创建路由模块对应的 js 文件
- 调用 `express.Router()` 函数创建路由对象
- 向路由对象上挂载具体的路由
- 使用 module.exports 向外共享路由对象
- 使用 `app.use()` 函数注册路由模块



​	路由模块书写：

```js
// router.js:
const express = require('express')
const router = express.Router()

router.get('/user/list', () => {
    res.send('Get user list.')
})
router.post('/user/add', () => {
    res.send('Add new user.')
})

module.exports = {"router": router}
```

​	注册路由模块：

```js
// server.js:
const { router } = require('./router')
app.use(router)
```



#### （3）路由模块前缀

​	如：

```js
//1.导入路由模块
const userRouter = require('./router/user.js')
//2.使用 app.use() 注册路由模块，并添加统一的访问前缀 /api
app.use('/api'，userRouter)
```


---
### 5、中间件

#### （1）概述

​	当一个请求到达 Express 的服务器之后，可以连续调用多个中间件，从而对这次请求进行预处理。

![image-20220511152436480.webp" w-80%](images/image-20220511152436480.webp)

​	**格式**：Express 的中间件，本质上就是一个 function 处理函数，Express 中间件的格式如下：

```js
app.get('/', function(req, res, next) {
    next();
})
```

​	注：中间件函数的形参列表中，**必须包含 next 参数**。而路由处理函数中只包含 req 和 res。next 函数是实现多个中间件连续调用的关键，**它表示把流转关系转交给下一个中间件或路由**。



#### （2）中间件的作用

​	多个中间件之间，共享同一份 req 和 res。基于这样的特性，我们可以**在上游的中间件中，统一为 req 或 res 对象添加自定义的属性或方法**，共享给下游的中间件或路由进行使用。



#### （3）全局中间件

​	**定义**：

```js
// 常量 mw 所指向的，就是一个中间件函数
// 注意：在当前中间件的业务处理完毕后，必须调用 next() 函数
// 表示把流转关系转交给下一个中间件或路由
const mw = function(req, res, next) {
    console.log('This is a simple middleware func.')
    next()
}
```

​	**全局生效中间件**：客户端发起的任何请求，到达服务器之后，都会触发的中间件，叫做全局生效的中间件。通过调用 `app.use(中间件函数)`，即可定义一个全局生效的中间件，如：

```js
app.use(mw)
```

​	**全局定义简化形式**：

```js
app.use((req, res, next) => {
    console.log('This is a simple middleware func.')
    next()
})
```

​	**连续定义**：按顺序书写，按顺序调用。



#### （4）局部中间件

​	**局部生效中间件**：该中间件被挂载到指定路由上。如：

```js
// 该路由挂载了 mw1 中间件
app.get('/user', mw1, function(req, res) {...})
```

​	**定义多个局部中间件**：按顺序给定或使用装到一个数组里（完全等价）。按书写顺序调用。

```js
app.get('/user', mw1, mw2, function(req, res) {...})
app.get('/user', [mw1, mw2], function(req, res) {...})
```



#### （5）中间件注意事项

- 一定在**路由注册前**注册中间件
- 客户端发送过来的请求，**可以连续调用**多个中间件处理
- 执行完中间件的代码，**不要忘记调用 `next()` 函数**
- 为了防止代码逻辑混乱，不要在 `next()` 函数后写任何代码
- 连续调用多个中间件时，多个中间件之间，共享 req 和 res 对象



#### （6）中间件分类

​	为了方便大家理解和记忆中间件的使用，Express 官方把常见的中间件用法，分成了 5 大类。

​	**应用级别的中间件**：通过 `app.use()` 或 `app.get()` 或  `app.post()`，**绑定到app 实例上**的中间件。

​	**路由级别的中间件**：绑定到 `express.Router()` 实例上的中间件，叫做路由级别的中间件。它的用法和应用级别中间件没有任何区别。只不过，应用级别中间件是绑定到 app 实例上，**路由级别中间件绑定到 router 实例上**，如：

```js
var router = express.Router()
router.use(中间件函数)
app.use('/', router)
```

​	**错误级别中间件**：专门用来捕获整个项目中发生的异常错误，从而防止项目异常崩溃的问题。不过其对应的处理函数有 4 个参数：`err, req, res, next`。注意：**这种中间件要在注册在所有路由之后！**。

```js
app.get('/', (req, res) => {
    throw new Error('自定义错误')
    res.send('Home page.')
})
app.use((err, req, res, next) => {
    console.log(`发生了错误：${err.message}`)
    res.send(`Error! ${err.message}`)
    next();
})
```

	

​	**Express 内置的中间件**：自 Express 4.16.0版本开始，Express 内置了 3 个常用的中间件，极大的提高了 Express 项目的开发效率和体验：

- `express.static` 快速托管静态资源的内置中间件，例如：HTML 文件、图片、CSS 样式等（无兼容性）
- `express.json` 解析 JSON 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）
- `express.urlencoded` 解析 URL-encoded 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）

```js
// 配置解析 application/json 格式数据的内置中间件
app.use(express.json())
// 配置解析 application/x-www-form-urlencoded 格式数据的内置中间件
app.use(express.urlencoded({ extended: false }))
```

```js
// 注：这样可以支持解析两种表单数据格式。因为某种格式解析失败不会修改 req.body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/user', (req, res) => {
    // 在服务器，可以使用 req.body 这个属性来接受请求体数据
    // 默认情况下，如果不配置解析表单数据的中间件，req.body 默认等于 undefined
    console.log(req.body)
    res.send('OK')
})
```



​	**第三方中间件**：非 Express 官方内置的，而是由第三方开发出来的中间件，叫做第三方中间件。在项目中，大家可以按需下载并配置第三方中间件，从而提高项目的开发效率。

​	如在 express@4.16.0 之前的版本中，经常使用 body-parser 这个第三方中间件来解析请求体数据。

​	**自定义中间件**：将其封装为自定义模块，引用即可。

​	
---
### 6、CORS 跨域资源共享实现

#### （1）方法

​	使用 cors 中间件可以解决跨域问题。

​	cors 是 Express 的一个第三方中间件。通过安装和配置 cors 中间件，可以很方便地解决跨域问题。

```bash
npm i cors
```

```js
// 一定要在路由注册前配置这个中间件
const cors = require('cors')
app.use(cors())
```



#### （2）CORS 相关三个请求头

​	请求头：`Access-Control-Allow-Origin` 

​	说明：origin 参数的值指定了允许访问该资源的外域URL。示例：

```js
res.setHeader('Access-Control-Allow-Origin', 'http://example.com')
```

​	

​	请求头：`Access-Control-Allow-Headers`

​	说明：默认情况下，CORS 仅支持客户端向服务器发送如下的 9 个请求头：`Accept`、`Accept-Language`、`Content-Language`、`DPR`、`Downlink`，`Save-Data`、`Viewport-Width`、`Width`、`Content-Type`（值仅限于 text/plain、multipart/form-data、application/x-www-form-urlencoded 三者之一）如果客户端向服务器发送了额外的请求头信息，则**需要在服务器端，通过 Access-Control-Allow-Headers 对额外的请求头进行声明**，否则这次请求会失败！示例：

```js
// 如允许客户端额外向服务器发送 Content-Type 请求头和 X-Custom-Header 请求头
// 注：多个请求头之间使用英文的逗号进行分割
res.setHeader('Access-Control-Allow-Headers', 'Content-Type，X-Custom-Header')
```



​	请求头：`Access-Control-Allow-Methods`

​	说明：默认情况下，CORS 仅支持客户端发起 GET、POST、HEAD 请求。如果客户端希望通过 PUT、DELETE 等方式请求服务器的资源，则需要在服务器端，通过 Access-Control-Alow-Methods 来指明实际请求所允许使用的 HTTP 方法。示例：

```js
// 只允许 POST、GET、DELETE、HEAD 请求方法
res.setHeader('Access-Control-Allow-Methods', 'POST，GET，DELETE，HEAD')
// 允许所有的 HTTP 请求方法
res.setHeader('Access-Control-A1low-Methods', "*")
```



#### （3）CROS 请求分类

​	客户端在请求CORS接口时，根据请求方式和请求头的不同，可以将 CORS 的请求分为两大类，分别是：简单请求和预检请求。



​	**简单请求**：同时满足以下两大条件的请求，就属于简单请求：

- 请求方式：GET、POST、HEAD 三者之一

- HTTP 头部信息不超过以下几种字段：无自定义头部字段、Accept、Accept-Language、Content-Language、DPR、Downlink、Save-Data、Viewport-Width、Width、Content-Type（只有三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain）

​	

​	**预检请求**：符合以下任意一个条件的请求，都需要先进行预检请求：

- 请求方式为 GET、POST、HEAD 之外的请求类型
- 请求头中包含自定义头部字段
- 向服务器发送了 application/json 格式的数据

​	注：在浏览器与服务器正式通信之前，浏览器会先发送 OPTION 请求进行预检，以获知服务器是否允许该实际请求，所以**这一次的 OPTION 请求称为"预检请求"**。服务器成功响应预检请求后，才会发送真正的请求，并且携带真实数据。



#### （4）jsonp 接口

​	概念：浏览器端通过 &lt;script&gt; 标签的 src 属性，请求服务器上的数据，同时，服务器返回一个函数的调用。这种请求数据的方式叫做 JSONP。

​	特点：

- JSONP 不属于真正的 Ajax 请求，因为它没有使用 XMLHttpRequest 这个对象。
- **JSONP 仅支持 GET 请求**，不支持 POST、PUT、DELETE 等请求。

​	注：如果项目中已经配置了 CORS 跨域资源共享，为了防止冲突，必须在配置 CORS 中间件之前声明 JSONP 的接口。否则 JSONP 接口会被处理成开启了 CORS 的接口。



---

## 四、数据库与身份认证

​	关于数据库与 mysql 数据库的知识、操作这里不再赘述。

### 1、操作数据库

​	这里以 mysql 数据库为例。

​	安装：想要操作 mysql 数据库，首先需要通过 npm 安装 mysql 模块。

```bash
npm i mysql
```

​	在使用前需要配置：

```js
const mysql = require('mysql')
const db = mysql.createPool({
    host: 'loclhost',
    user: 'root',
    password: '123',
    database: 'sample'
})
```

​	

​	**查询语句**：

```js
query_str = 'select author, count(*) as poetNum from tang\
            group by author\
            order by count(*) desc\
            limit 0, 10'
db.query(query_str, (err, results) => {
    if (err) return console.error(err.message)
    console.log(results)
})
```

​	注：查询执行成功返回的是数组。



​	**插入语句**：

```js
const user = { id: '2', name: 'MelodyScend', password: '12345'}
// ? 表示占位符
const sqlStr = 'insert into user(`id`, `name`, `password`) values(?, ?, ?)'
// 使用数组形式，可以依次将值填充到 ? 位置，如果只有一个占位符，可以直接作为参数
db.query(sqlStr, [user.id, user.name, user.password], (err, results) => {
    if (err) return console.error(err.message)
    console.log(results);
    if (results.affactedRows === 1) console.log('插入成功')
})
```

​	更新和删除语句操作类似。

---

### 2、web 开发模式概述

​	**服务端渲染**：服务器发送给客户端的 HTML 页面，是在服务器通过字符串的拼接，动态生成的。因此，客户端不需要使用 Ajax 这样的技术额外请求页面的数据。优点：前端耗时少，有利于 SEO。缺点：服务器压力大、前后端不分离、开发效率低。

​	**前后端分离**：开发体验好。前端专注于 UI 页面的开发，后端专注于 api 的开发，且前端有更多的选择性。优点：开发体验好、用户体验好、减轻了服务端压力。缺点：不利于 SEO。

​	注：具体选择什么开发模式，取决于业务场景。且选择什么开发模式也不是固定的，可以两种方式都使用。（如首屏服务端渲染，其他页面前后端分离）

---

### 3、身份认证

​	身份认证（Authentication）又称"身份验证"、"鉴权"，是指通过一定的手段，完成对用户身份的确认。

​	不同开发模式下的身份认证：

- 服务端渲染推荐使用 Session 认证机制
- 前后端分离推荐使用 JWT 认证机制


---
### 4、session 认证机制

#### （1）HTTP 无状态与 Cookie

​	**HTTP 协议的无状态性**：客户端的每次 HTTP 请求都是独立的，连续多个请求之间没有直接的关系，服务器不会主动保留每次 HTTP 请求的状态。

​	可以通过 Cookie 解决这个问题。Cookie 是存储在用户浏览器中的一段不超过 4KB 的字符串。它由一个名称（Name）、一个值（Value）和其它几个用于控制 Cookie **有效期、安全性、使用范围**的可选属性组成。



​	注意：不同域名下的 Cookie **各自独立**，每当客户端发起请求时，会自动把当前域名下**所有未过期的 Cookie **一同发送到服务器。

​	总结 Cookie 的几大特性：

- 自动发送
- 域名独立
- 过期时限
- 4kb 限制



​	**重点**：由于 Cookie 是存储在浏览器中的，而且浏览器也提供了读写 Cookie 的 APl，因此 Cookie 很容易被伪造，不具有安全性。因此不建议服务器将重要的隐私数据，通过 Cookie 的形式发送给浏览器。



#### （2）提高身份认证的安全性

​	如同"会员卡+刷卡认证"的机制，我们引入 cookie + session 的机制。

​	原理如下：

![image-20220511213035928](images/image-20220511213035928.webp)



#### （3）express-session 中间件

​	**安装**：

```bash
npm i express-session
```

​	**配置**：

```js
var session = require('express-session')
app.use(session({
    secret: 'a cat',
    resave: false,			// 固定写法
    saveUninitialized: true  // 固定写法
}))
```

​	

​	**向 session 中存入数据**：当 express-session 中间件配置成功后，即可通过 req.session 来访问和使用 session 对象，从而存储用户的关键信息：

```js
app.post('/api/login', (req, res) => {
    if (req.body.username !== 'admin' || req.body.password !== '000') {
        return res.send({ status: 1, msg: 'login failed.'})
    }
    req.session.user = req.body		// 存储用户信息
    req.session.islogin = true		// 存储用户登录状态
    res.send({ status: 1, msg: 'login success.'})
})
```



​	**从 session 中取出数据**：

```js
app.get('/api/username', (req, res) => {
    if (!req.session.islogin) {
        return res.send({ status: 0, msg: 'failed'})
    }
    res.send({ status: 1, msg: 'success'})
})
```



​	**清空 session**：调用 `req.session.destroy()` 函数，即可清空服务器保存当前用户的 session 信息。

```js
app.post('/api/logout', (req, res) => {
    req.session.destroy()
    res.send({
        status: 0,
        msg: '退出登录成功'
    })
})
```


---
### 5、JWT 认证机制

#### （1）概述

​	**Session 认证机制缺点**：需要配合 Cookie 才能实现。由于 Cookie 默认不支持跨域访问，所以，当涉及到前端跨域请求后端接口的时候，需要做很多额外的配置，才能实现跨域 Session 认证。此时推荐使用 JWT认证机制。

​	 **JWT（JSON Web Token） 认证**：目前最流行的跨域认证解决方案。

​	工作原理：

![image-20220511220216869](images/image-20220511220216869.webp)

​	总结：用户的信息通过加密的 token 字符串存储在客户端，服务器还原来进行验证。



​	JWT 组成部分：通常由三部分组成，分别是Header（头部）、Payload（有效荷载）、Signature（签名）。如下：

```text
Header.Payload.Signature
```

```text
eyJhbGcioiJIUzI1NiIsInRScCI6IkpXVCJ9.eyJpZCI6MSwidXN1cm5hbwUi0iJhZ61pbiIsInBhc3N3b3JkIjoiliwibmlja25hbwUioiLms6X1t7Tlt7QiLCJ1bwFpbCI6Im5pYmFiYUBpdGNhc3QuY24iLCJ1c2VyX3BpYyI6iIsImlhdCI6MTU30DAzNjY4MiwizXhwIjoxNTc4MlDcyNjgyfQ.Mwq7GqCXJPK-EA8LNrtNG0411KdZ33S9KBL3XeuBxuI
```

​	说明：**Payload 部分才是真正的用户信息**，它是用户信息经过加密之后生成的字符串。Header 和 Signature 是安全性相关的部分，只是为了保证 Token 的安全性。



​	使用方式：放在请求头的 `Authorization` 字段：

```text
Authorization: Bearer <token>
```



#### （2）安装和使用

​	**安装**：

```bash
npm i jsonwebtoken express-jwt
```

​	其中：

- jsonwebtoken 用于生成JWT字符串
- express-jwt 用于将 JWT 字符串解析还原成 JSON 对象



​	**使用**：

```js
// 导入（最近发生了大版本迭代，express-jwt 用法和以前不同了）
const jwt = require('jsonwebtoken')
const { expressjwt } = require('express-jwt')

// 设置 secret 密钥，用于加解密
const secretKey = 'example.com'

// 注册将 token 字符串还原成 JSON 对象的中间件，同时填写不需要验证的路径（路径要写全），这里也可以用正则表达式实现对路由验证
// 配置成功该中间件，可以通过 req.auth 访问到 token 字符串中的信息对象
app.use(expressjwt({
    secret: secretKey,
    algorithms: ['HS256'],		// 指定加密算法，必需
    credentialsRequired:true })
.unless({ path: [/^\/api\//] }))

// 登录
app.post('/api/login', (req, res) => {
    // 进行用户名和密码验证
    if (req.body.username != 'MelodyEcho' || req.body.password != '18') {
        return res.send({
            status: 401,
            msg: 'invalid',
        })
    }
    // 生成 token 字符串，参数：信息对象，密钥，有效期(秒)。注意 token 中不要放入密码！
	const token = jwt.sign({ username: req.body.username }, secretKey, { expiresIn: 60 })
	console.log(`用户 ${req.body.username} 的 token 已分配`)
	res.send({
        status: 200,
        msg: 'success',
        token: token
	})
})

// 获取信息
app.get('/admin/getinfo', (req, res) => {
    // req.auth.iat 与 req.auth.exp 是自动添加的属性
    console.log(`用户 ${req.auth.username} 发起了信息获取，于 ${req.auth.iat} 注册，于 ${req.auth.exp} 过期`)
    res.send({
        status: 200,
        msg: 'success',
        data: req.auth
    })
})

...

// 在路由之后注册一个全局错误中间件，捕获 token 过期或不合法的情况
app.use((err, req, res, next) => {
    if (err.name == 'UnauthorizedError') {
        console.log('客户端请求携带了一个无效或过期的 token')
        return res.send({ status: 401, msg: 'expired or invalid'})
    }
    return res.send({status: 500, msg: 'error'})
})
```
