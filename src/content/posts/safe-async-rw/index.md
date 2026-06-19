---
title: "安全异步读写原理与实现"
published: 2023-09-01
description: "安全异步读写，是并发控制中的经典问题"
tags: ["python", "asyncio", "async", "concurrency"]
category: "computer-science"
pinned: false
image: "https://miku.top/[dyn-img]"
licenseName: "CC BY-SA 4.0"
author: "律回"
draft: false
---

# 安全异步读写原理与实现

### 1、基本原理

异步读写问题与常规异步问题不同，不是单纯的互斥问题。对于安全的异步读写，为了同时保证安全性和并发性能，需要实现：

- 读取时：不允许写入。但可以再并行/并发地读取。
- 写入时：不允许读取。也不允许其他写入。

结合操作系统原理课的知识，我们可以得到用 PV 原语表示的，并发读写的伪代码：

```python
# 写信号量
Semaphore WS = 1
# 当前正在读的计数变量
int RN = 0
# 变量 RN 的操作锁
Mutex L


def safe_write():
    P(WS)
    # 写操作
    write()
    V(WS)


def safe_read():
    P(L)
        if RN == 0:
            P(WS)
        RN += 1
    V(L)
    # 读操作
    read()
    P(L)
        RN -= 1
        if RN == 0:
            V(WS)
    V(L)
```

当然，在某些情况下，可能需要限制读的并发度，那么可以再添加一个信号量变量：

```python
# 写信号量
Semaphore WS = 1
# 读信号量，值为一个常量
Semaphore RS = N
# 当前正在读的计数变量
int RN = 0
# 变量 RN 的操作锁
Mutex L


def safe_write():
    P(WS)
    # 写操作...
    write()
    V(WS)


def safe_read():
    P(RS)
        P(L)
            if RN == 0:
                P(WS)
            RN += 1
        V(L)
        # 读操作...
        read()
        P(L)
            RN -= 1
            if RN == 0:
                V(WS)
        V(L)
    V(RS)
```



### 2、代码实现

以下所有实现，均使用 Python。

在 Python 中，PV 原语有线程版、协程版、进程版的对应实现。因此可以在各种情景下很方便地做到安全异步读写。

不过需要注意的是，由于 Python GIL 的存在，任何时候只有一个线程在运行。因此如果使用多线程，读无法实现并行，最多实现并发。当然如果使用多进程，就可以并行了。以下是多线程异步安全读写的实现示例：

```python
import threading
import random
import time

write_semaphore = threading.Semaphore(1)
# 设置读的并发度为 2
read_semaphore = threading.Semaphore(2)
read_num = 0
read_num_lock = threading.Lock()
test_var = "initial value"

def safe_write():
    def _write():
        global test_var
        test_var =  random.randint(1, 1000000)
        # 模拟写操作需要的时间
        time.sleep(0.5)
        print(f"Changed to {test_var}")
    write_semaphore.acquire()
    _write()
    write_semaphore.release()

def safe_read():
    def _read():
        global test_var
        print(test_var)
    global read_num
    read_semaphore.acquire()
    with read_num_lock:
        if read_num == 0:
            write_semaphore.acquire()
        read_num += 1
    _read()
    with read_num_lock:
        read_num -= 1
        if read_num == 0:
            write_semaphore.release()
    read_semaphore.release()

if __name__ == "__main__":
    threads = []
    for i in range(5):
        threads.append(threading.Thread(target=safe_read))
        threads.append(threading.Thread(target=safe_write))
    # 打乱列表，模拟读写线程的先后到来
    random.shuffle(threads)
    for t in threads:
        t.start()
    for t in threads:
        t.join()
```

运行上述代码，获得的结果比较随机。比如：

```bash
Changed to 556931
Changed to 938396
938396
Changed to 925837
Changed to 436704
Changed to 608686
608686
608686608686

608686
```

简单分析一下：

- 读线程打印的值不会和 "Changed..." 重合，说明读写互斥
- 读线程打印的值会重合，且最多重合两次，说明可以并发执行，且并发度最大为 2

符合我们预设的目标。

如果使用 `asyncio` ，则可以实现多协程的版本，代码很类似：

```python
import asyncio
import random

write_semaphore = asyncio.Semaphore(1)
read_semaphore = asyncio.Semaphore(2)
read_num = 0
read_num_lock = asyncio.Lock()
test_var = "initial value"

async def safe_write():
    async def _write():
        global test_var
        test_var =  random.randint(1, 1000000)
        await asyncio.sleep(0.5)
        print(f"Changed to {test_var}")
    await write_semaphore.acquire()
    await _write()
    write_semaphore.release()

async def safe_read():
    def _read():
        global test_var
        print(test_var)
    global read_num
    await read_semaphore.acquire()
    async with read_num_lock:
        if read_num == 0:
            await write_semaphore.acquire()
        read_num += 1
    _read()
    async with read_num_lock:
        read_num -= 1
        if read_num == 0:
            write_semaphore.release()
    read_semaphore.release()

async def main():
    coros = []
    for i in range(5):
        coros.append(safe_read())
        coros.append(safe_write())
    random.shuffle(coros)
    tasks = [asyncio.create_task(coro) for coro in coros]
    await asyncio.wait(tasks)

if __name__ == "__main__":
    asyncio.run(main())
```

由于 `asyncio` 是单线程实现的多协程，因此所有操作实际都在一个线程上。不会出现对线程不安全的 `print()` 的同时调用，因此打印出来的结果很整洁：

```bash
Changed to 17815
Changed to 405116
405116
405116
Changed to 678826
Changed to 88906
Changed to 989941
989941
989941
989941
```



### 3、实际使用

在实际业务场景中，读和写的方法可能千变万化，需要按需提供。对此可以使用 Python 的上下文管理器，将实际的读写方法解耦出来：

```python
import contextlib
import threading

write_semaphore = threading.Semaphore(1)
read_semaphore = threading.Semaphore(2)
read_num = 0
read_num_lock = threading.Lock()

# 如果异常没有在上下文中（即 with 子句下）捕获，则抛出
@contextlib.contextmanager
def safe_read():
    global read_num
    read_semaphore.acquire()
    with read_num_lock:
        if read_num == 0:
            write_semaphore.acquire()
        read_num += 1
    try:
        yield
    finally:
        with read_num_lock:
            read_num -= 1
            if read_num == 0:
                write_semaphore.release()
            read_semaphore.release()

@contextlib.contextmanager
def safe_write():
    write_semaphore.acquire()
    try:
        yield
    finally:
        write_semaphore.release()
```

使用时只需要：

```python
with safe_read():
    ...
with safe_write():
    ...
```

值得注意的是，此时所有使用 `safe_read`、`safe_write` 的代码，都会共用一套读写控制逻辑，这显然不太合适。我们更希望对一个或一类资源，有独立的读写控制。这提示我们可以把它封装为类来进一步解耦：

```python
import contextlib
import threading

class RWController:
    def __init__(self, max_read_num: int=None) -> None:
        # max_read_num 如果不为 None，意味着有读的并发限制
        # 注意这是 __init__() 方法下的函数
        @contextlib.contextmanager
        def safe_read():
            nonlocal read_num, read_semaphore, write_semaphore, read_num_lock
            if read_semaphore:
                read_semaphore.acquire()
            with read_num_lock:
                if read_num == 0:
                    write_semaphore.acquire()
                read_num += 1
            try:
                yield
            finally:
                with read_num_lock:
                    read_num -= 1
                    if read_num == 0:
                        write_semaphore.release()
                    if read_semaphore:
                        read_semaphore.release()

        @contextlib.contextmanager
        def safe_write():
            nonlocal write_semaphore
            write_semaphore.acquire()
            try:
                yield
            finally:
                write_semaphore.release()
			
        write_semaphore = threading.Semaphore(1)
        if max_read_num:
            read_semaphore = threading.Semaphore(max_read_num)
        else:
            read_semaphore = None
        read_num = 0
        read_num_lock = threading.Lock()
        self.safe_read = safe_read
        self.safe_write = safe_write
```

此时外部就可以初始化这个类，获得一个独立的读写控制器：

```python
rwc1 = RWController()
rwc2 = RWController(max_read_num=5)

with rwc1.safe_read():
    ...
with rwc2.safe_read():
    ...
with rwc1.safe_write():
    ...
with rwc2.safe_write():
    ...
```

这样依然需要外部手动调用 `with` 来进行上下文管理，好处是非常灵活。

但如果只是需要某个方法获得安全的异步读写，另一个比较好的思路是通过装饰器来处理。那怎么使用装饰器处理呢？

首先让我们来看一个类的源码。它是 `contextlib.ContextDecorator` ：

```python
class ContextDecorator(object):
    def _recreate_cm(self):
        return self

    def __call__(self, func):
        @wraps(func)
        def inner(*args, **kwds):
            with self._recreate_cm():
                return func(*args, **kwds)
        return inner
```

不难发现，继承该类并实现 `__enter__()` 和 `__exit__()` 方法后，产生的对象如果被用作装饰器方法，会执行 `__call__()` 这个装饰器函数。之后的执行逻辑就是：通过内部的 with 语句，在执行 `__enter__()` 后，执行被装饰的函数，最后再调用 `__exit__()` ，实现自动的上下文管理。

让我们用上这个类，来实现刚才的目标：

```python
import contextlib
import threading

class RWController:
    def __init__(self, max_read_num: int=None) -> None:
        super().__init__()
        # max_read_num 不为 None，意味着有读的并发限制
        if max_read_num:
            self.read_semaphore = threading.Semaphore(max_read_num)
        else:
            self.read_semaphore = None
        self.write_semaphore = threading.Semaphore(1)
        self.read_num = 0
        self.read_num_lock = threading.Lock()
        self.safe_read = RWController.ReadController(
            self.read_semaphore, self.write_semaphore, 
            self.read_num_lock, self.read_num
        )
        self.safe_write = RWController.WriteController(self.write_semaphore)

    class ReadController(contextlib.ContextDecorator):
        def __init__(self, read_semaphore, write_semaphore, read_num_lock, read_num) -> None:
            super().__init__()
            self.read_semaphore: threading.Semaphore = read_semaphore
            self.write_semaphore: threading.Semaphore = write_semaphore
            self.read_num_lock: threading.Lock = read_num_lock
            self.read_num = read_num

        def __enter__(self) -> None:
            # 读信号量不为 None，意味着有读的并发限制
            if self.read_semaphore:
                self.read_semaphore.acquire()
            with self.read_num_lock:
                if self.read_num == 0:
                    self.write_semaphore.acquire()
                self.read_num += 1

        def __exit__(self, *exc) -> None:
            with self.read_num_lock:
                self.read_num -= 1
                if self.read_num == 0:
                    self.write_semaphore.release()
                # 读信号量不为 None，意味着有读的并发限制
                if self.read_semaphore:
                    self.read_semaphore.release()
    
    class WriteController(contextlib.ContextDecorator):
        def __init__(self, write_semaphore) -> None:
            super().__init__()
            self.write_semaphore: threading.Semaphore = write_semaphore

        def __enter__(self) -> None:
            self.write_semaphore.acquire()
        
        def __exit__(self, *exc) -> None:
            self.write_semaphore.release()
```

使用的时候，只要这样就可以了：

```python
rwc = RWController()

@rwc.safe_write
def custom_write():
    ...

@rwc.safe_read
def custom_read():
    ...
```

同理，你也可以使用多进程、多协程来实现上面的这些具体方案。对于多协程实现，需要注意：

- `contextmanager` 有其对应的协程异步版本：`asynccontextmanager`，可以直接使用
- `ContextDecorator` 类没有其对应的协程异步版本，需要自己实现。原理类似，不过是改用 `async with`，以及 `__aenter__()`、`__aexit__()`



### 4、后话

第三方模块中，已经有比较成熟的安全异步读写解决方案了。例如基于 `asyncio` 多协程的实现：aiorwlock。

感兴趣的话，可以自行阅读源码了解。