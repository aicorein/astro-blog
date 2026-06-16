---
title: "Python 并发编程之多协程"
published: 2022-11-25
description: "通过 asyncio 在 Python 实现基于协程的并发编程"
tags: ["python", "concurrency", "asyncio"]
category: "computer-science"
pinned: false
image: "https://api.anosu.top/img/?sort=pc&size=mw1920&t=1781645179"
licenseName: "CC BY-SA 4.0"
author: "律回"
draft: false
---

# Python 并发编程之多协程

## 一、协程简述

协程不是计算机提供，程序员人为创造。

协程（Coroutine），也可以被称为微线程，是一种用户态内的上下文切换技术。简而言之，其实就是通过一个线程实现代码块相互切换执行。实现协程的方法有：
- greenlet、早期模块
- yield 关键字
- asyncio 装饰器（py3.4）
- async、await 关键字（py3.5）【推荐】

### 1、greenlet 实现

```python
pip install greenlet
from greenlet import greenlet
 
def func1():
    print(1)
    gr2.switch()
    print(2)
    gr2.switch()
    
def func2():
    print(3)
    gr1.switch()
    print(4)
 
gr1 = greenlet(func1)
gr2 = greenlet(func2)
gr1.switch()
```

### 2、yield 关键字实现

```python
def func1():
    yield 1
    yield from func2()
    yield 2
 
def func2():
    yield 3
    yield 4
 
f1 = func1()
for item in f1:
    print(item)
```

### 3、asyncio 实现

```python
import asyncio
 
@asyncio.coroutine
def func1():
    print(1)
    # 遇到 IO 耗时操作，自动切换到 tasks 中的其他任务
    yield from asyncio.sleep(2)
    print(2)
 
@asyncio.coroutine
def func2():
    print(3)
    yield from asyncio.sleep(2)
    print(4)
 
tasks = [
    asyncio.ensure_future(func1()),
    asyncio.ensure_future(func2()),
]
loop = asyncio.get_event_loop()
loop.run_until_complete(asyncio.wait(tasks))
```

特别之处：遇到 IO 阻塞就自动切换

### 4、async&await 关键字实现

```python
import asyncio
 
async def func1():
    print(1)
    # 遇到 IO 耗时操作，自动切换到 tasks 中的其他任务
    # 这里是设置该协程的休眠
    await asyncio.sleep(2)
    print(2)
 
async def func2():
    print(3)
    await asyncio.sleep(2)
    print(4)
 
tasks = [
    asyncio.ensure_future(func1()),
    asyncio.ensure_future(func2()),
]
loop = asyncio.get_event_loop()
loop.run_until_complete(asyncio.wait(tasks))
```

## 二、基于协程的异步

### 1、事件循环

```python
# 伪代码
任务列表 = [任务1, 任务2, 任务3]
while True：
    可执行任务列表，已完成任务列表 = 检查列表中所有任务，将可执行和已完成的任务返回
    for 就绪任务 in 可执行的任务列表：
    	执行已就绪的任务
    for 已完成的任务 in 已完成的任务列表：
    	在任务列表中移除已完成的任务
    如果任务列表中的任务都已完成，则终止循环
import asyncio
# 生成事件循环
loop = asyncio.get_event_loop()
# 将任务放到任务列表
loop.run_until_complete(任务)
```

### 2、async 关键字
​ 
协程函数：使用 async 关键字定义的函数。

​协程对象：执行协程函数得到的对象。

​注：执行协程函数会创建协程对象，函数内部代码不会执行。如果想要运行协程函数内部代码，需要将协程对象交给事件循环。

```python
import asyncio
 
async def func():
    print('执行 async 函数内部代码~')
asyncio.run(func())
```

### 3、await 关键字
​ 
await 后要跟可等待对象。（包括协程对象、Future对象、Task对象）

```python
import asyncio
 
async def other():
    print("start")
    await asyncio.sleep(2)
    print("end")
    return 'value'
 
async def func():
    print("执行协程函数内部代码")
    resp = await other()
    print("阻塞结束，结果为：", resp)
 
asyncio.run(func())
```
​ 
await 就是等待值获取后再往下执行，等待时事件循环切换到其他任务。


### 4、Task 对象

​Task 是对协程的包装。在事件循环中添加多个任务，即可并发调度协程。而且任务是可以包含各种状态的，便于对异步操作状态的控制。

​Task 用于并发调度协程，通过 asyncio.create_task(协程对象) 的方式创建 Task 对象，可以让协程加入事件循环中等待被调度执行。除了使用 asyncio.create_task() 函数以外，还可以用低层级的 loop.create_task() 或 asyncio.ensure_future() 函数。不建议手动实例化 Task 对象。

​注意：asyncio.create_task() 函数在 Python3.7 中被加入。在 Python3.7 之前，可以改用低层级的 asyncio.ensure_future() 函数。

​关于 Task 对象，更多详见：[asyncio.Task](https://docs.python.org/3/library/asyncio-task.html?highlight=#asyncio.Task)

示例：

```python
import asyncio
 
async def func():
    print(1)
    await asyncio.sleep(2)
    print(2)
    return "value"
 
async def main():
    print("main 开始")
    # 可以分别 await 多个任务，但添加多任务时，一般像下面这样写：
    # 同时可以取名方便最后区分
    task_list = [
        asyncio.create_task(func(), name='f1'),
        asyncio.create_task(func(), name='f2')
    ]
    print("main 添加任务结束")
    # 可以设置超时，超时未完成即在 pending 中
    # 从 >py3.8 开始，向该方法传递协程的可迭代对象将导致混淆行为，所以最好像这里一样传递 Task 可迭代对象
    done, pending = await asyncio.wait(task_list, timeout=None)
    for t in done:
        print(t.get_name(), t.result())
 
asyncio.run(main())
```
​ 
也可以对 Task 对象使用 add_done_callback()添加回调。​对于某些情况，可能会先定义 task_list，此时的写法将会有所不同：（由于上面所述原因，py 3.8 后开始已经不支持这么做，因此下面的代码仅限于 <=py 3.8 使用）

```python
import asyncio
 
async def func():
    print(1)
    await asyncio.sleep(2)
    print(2)
    return "value"
 
task_list = [
    func(), func()
]
# 会先启动 event_loop，再添加任务
done, pending = asyncio.run(asyncio.wait(task_list))
print(done)
```
​ 
所以最好创建一个 main() 协程函数，在其内添加 Task，最后让 event_loop 接管 main 协程。

### 5、Future 对象

Future 是一个特殊的低级可等待对象，表示异步操作的最终结果。

​Task 类继承于 Future 类，同时 Task 对象内部 await 结果的处理基于 Future 对象。

### 6、asyncio + 同步模块的异步实现
​
以一个爬虫为例：

```python
import asyncio
import requests
 
async def download_image(url):
    print('开始下载', url)
    loop = asyncio.get_event_loop()
    # 同步模块不支持异步协程，因此使用进程池
    future = loop.run_in_executor(None, requests.get, url)
    resp = await future
    print('下载完成')
    # 之后进行一些处理/保存工作
    
async def main():
    url_list = [
        'https://www.xxx.com',
        'https://www.yyy.com',
        'https://www.zzz.com'
    ]
    tasks = [asyncio.create_task(download_image(url)) for url in url_list]
   	done, pending = await asyncio.wait(tasks)
    
asyncio.run(main())
```

### 7、异步迭代器
​
异步迭代器：实现了 `__aiter__()` 和 `__anext__()` 方法的对象。 `__anext__()` 必须返回一个 awaitable 对象。 async for 会处理异步迭代器的 `__anext__()` 方法所返回的可等待对象，直到其引发一个 `StopAsyncrIteration` 异常。

​ 异步可迭代对象：可在 async for 语句中被使用的对象。必须通过它的 `__aiter__()` 方法返回一个异步迭代器。

```python
import asyncio
 
class Reader:
    """自定义异步迭代器"""
    def __init__(self):
        self.count = 0
    async def readline(self):
        self.count += 1
        if self.count == 100:
            return None
        return self.count
    def __aiter__(self):
        return self
    async def __anext__(self):
        val = await self.readline()
        if val == None:
            raise StopAsyncIteration
        return val
 
async def func():
	obj = Reader()
	# async 关键字只能在协程函数中使用
	async for item in obj:
		print(item)
asyncio.run(func())
```

### 8、异步上下文管理器
​
此种对象通过 `__aenter__()` 和 `__aexit__()` 方法来对 async with 语句中的环境进行控制。

```python
import asyncio
 
class AsyncDbManager:
    def __init__(self):
        self.conn = conn
    async def do_something(self):
        # 异步操作数据库 
        return 666
    async def __aenter__(self):
        # 异步链接数据库
        self.conn = await asyncio.sleep(1)
        return self
    async def __aexit__(self, exc_type, exc, tb):
        # 异步关闭数据库
        await asyncio.sleep(1)
 
async def main():
    async with AsyncDbManager() as f:
        result = await f.do_something()
        print(result)
        
asyncio.run(main())
```

## 三、uvloop

​uvloop 可以使 asyncio 更快。事实上，它至少比 nodejs、gevent 和其他 Python 异步框架要快两倍 。基于 uvloop 的 asyncio 的速度几乎接近了 Go 程序的速度。

```bash
pip install uvloop
```

```python
import asyncio
import uvloop
asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())
# 其他异步 asyncio 的代码，与之前一致
...
# 内部的事件循环会自动变为 uvloop
asyncio.run(...)
```
