---
title: "Python 设计模式"
published: 2022-11-25
description: "基于 Python 的常见设计模式实现"
tags: ["python"]
category: "computer-science"
permalink: "python-patterns"
pinned: false
image: "https://api.anosu.top/img/?sort=pc&size=mw1920"
licenseName: "CC BY-SA 4.0"
author: "律回"
draft: false
---

# Python 设计模式

## 一、简述

​	**设计模式**：对软件设计中普遍存在（反复出现）的各种问题，所提出的解决方案。每一个设计模式系统地命名、解释和评价了面向对象系统中一个重要的和重复出现的设计。

​	**接口**：若干抽象方法的集合。作用是限制实现接口的类必须按照接口给定的调用方式实现这些方法；对高层模块隐藏了类的内部实现。

```python
from abc import ABC, abstractmethod

# 这里的 Payment 方法就是接口类
class Payment(ABC):
    @abstractmethod
    def pay(self, money):
        pass

class Alipay(Payment):
    def pay(self, money):
        def pay(self, moeny):
            print('支付宝支付 %d 元' %money)

p = Alipay()
p.pay(100)
```

​	**面向对象设计的 SOLID 原则**：

- 开放封闭原则：一个软件实体如类、模块和函数应该对扩展开放，对修改关闭。即软件实体应尽量在不修改原有代码的情况下进行扩展。
- 里氏替换原则：所有引用父类的地方必须能透明地使用其子类的对象。(引用了用户类的地方一定要兼容 VIP 用户类)
- 依赖倒置原则：高层模块不应该依赖低层模块，二者都应该依赖其抽象（依赖于接口）；抽象不应该依赖细节；细节应该依赖抽象。换言之，要针对接口编程，而不是针对实现编程。
- 接口隔离原则：使用多个专门的接口，而不使用单一的总接口，即客户端不应该依赖那些它不需要的接口。（接口的粒度应该足够小）
- 单一职责原则：不要存在多于一个导致类变更的原因。通俗的说，即一个类只负责一项职责。

​	**设计模式分类**：

- 创建型模式（关注对象的创建）（5种）：工厂方法模式、抽象工厂模式、创建者模式、原型模式、单例模式
- 结构型模式（关注类与类之间的结构）（7种）：适配器模式、桥模式、组合模式、装饰模式、外观模式、享元模式、代理模式
- 行为型模式（关注实现具体行为）（11种）：解释器模式、责任链模式、命令模式、迭代器模式、中介者模式、备忘录模式、观察者模式、状态模式、策略模式、访问者模式、模板方法模式

​	**名词解释**：

- 客户端：指来自更高层的调用方



## 二、创建型模式

### 1、简单工厂模式

​	内容：不直接向客户端暴露对象创建的实现细节，而是**通过一个工厂类来负责创建产品类的实例**。

​	角色：

- 工厂角色（Creator）
- 抽象产品角色（Product）
- 具体产品角色（Concrete Product）

```python
# 抽象产品
class Payment(ABC):
    @abstractmethod
    def pay(self, money): pass
# 具体产品
class Alipay(Payment):
    def pay(self, money): pass
class WechatPay(Payment):
    def pay(self, money): pass
# 工厂
class PaymentFactory:
    def create_payment(self, method):
        if method == 'alipay':
            return Alipay()
        elif method == 'wechatpay':
            return WechatPay()
        else:
            raise TypeError

pf = PaymentFactory()
p = pf.create_payment('alipay').pay(100)
```

​	优点：

- 隐藏了对象创建的实现细节

- 客户端不需要修改代码

​	缺点：

- 违反了单一职责原则
- 将创建逻辑几种到一个工厂类里当添加新产品时，需要修改工厂类代码，违反了开闭原则



### 2、工厂方法模式

​	内容：定义一个用于创建对象的接口（工厂接口），让子类决定实例化哪一个产品类。

​	角色：

- 抽象工厂角色（Creator）
- 具体工厂角色（Concrete Creator）
- 抽象产品角色（Product）
- 具体产品角色（Concrete Product）

```python
# 抽象产品
class Payment(ABC):
    @abstractmethod
    def pay(self, money): pass
# 具体产品
class Alipay(Payment):
    def pay(self, money): pass
class WechatPay(Payment):
    def pay(self, money): pass
# 抽象工厂
class PaymentFactory:
    @abstractmethod
    def create_payment(self):
        pass
# 具体工厂
class AlipayFactory(PaymentFactory):
    def create_payment(self):
    	return Alipay()
class WechatPayFactory(PaymentFactory):
    def create_payment(self):
    	return WechatPay()

pf = WechatPayFactory()
p = pf.create_payment().pay(100)
```

​	优点：

- 每个具体产品都对应一个具体工厂类，不需要修改工厂类代码
- 隐藏了对象创建的实现细节

​	缺点：

- 每增加一个具体产品类，就必须增加一个相应的具体工厂类



### 3、抽象工厂模式

​	内容：定义一个工厂类接口，让工厂子类来创建一系列相关或相互依赖的对象。

​	重点：**让一个工厂生产几类对象，同时加以约束，使其形成一套产品**。

```python
# 抽象产品
class PhoneShell(ABC):
    @abstractmethod
    def show_shell(self): pass
class CPU(ABC):
    @abstractmethod
    def show_CPU(self): pass
class OS(ABC):
    @abstractmethod
    def show_OS(self): pass
# 具体产品
class SmallShell(PhoneShell): def show_shell(self): pass
class SnapDragonCPU(CPU): def show_CPU(self): pass
class Android(OS): def show_os(self): pass
# 抽象工厂
class PhoneFactory(ABC):
    def make_shell(self): pass
    def make_CPU(self): pass
    def make_OS(self): pass
# 具体工厂
class MiFactory(PhoneFactory):
    def make_shell(self): return SmallShell()
    def make_CPU(self): return SnapDragonCPU()
    def make_OS(self): return Android()

# 客户端
class Phone:
    def __init__(self, cpu, shell, os):
        self.cpu, self.shell, self.os = cpu, shell, os
    def show_info(self):
        self.cpu.show_CPU()
        self.shell.show_shell()
        self.os.show_os()
def make_phone(factory):
    cpu = factory.make_cpu()
    shell = factory.make_shell()
    os = factory.make_os()
    return Phone(cpu, shell, os)

p1 = make_phone(MiFactory())
p1.show_info()
```

​	优点：

- 将客户端与类的具体实现相分离
- 每个工厂创建了一个完整的产品系列，使得易于交换产品系列
- 有利于产品的一致性（即产品之间的约束关系）

​	缺点：

- 难以支持新种类的（抽象）产品（比如本例中，要加入新种类的产品"屏幕"）



### 4、建造者模式

​	内容：将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。

​	重点：建造者模式与抽象工厂模式相似，也用来创建复杂对象。主要区别是建造者模式着重**一步步构造一个复杂对象**，而抽象工厂模式着重于多个系列的产品对象。

​	角色：

- 抽象建造者（Builder）
- 具体建造者（Concrete Builder）
- 指挥者（Director）
- 产品（Product）

```python
# 产品
class Player:
    def __init__(self, face=None, body=None):
        self.face, self.body = face, body
    def __str__(self): return '%s %s' %(self.face, self.body)
# 抽象建造者
class PlayerBuilder(ABC):
    @abstractmethod
    def build_face(self): pass
    @abstractmethod
    def build_body(self): pass
# 具体建造者
class SexyGirlBuilder(PlayerBuilder):
    def __init__(self):
        self.player = Player()
    def build_face(self):
        self.player.face = 'very nice'
    def build_body(self):
        self.player.body = 'slim'
# 指挥者
class PlayerDirector:
    # 控制组装顺序
    def build_player(self, builder):
        builder.build_body()
        builder.build_face()
        return build.player

# 客户端
builder = SexyGirlBuilder()
director = PlayerDirector()
p = director.build_player(builder)
```

优点：

- 隐藏了一个产品的内部结构和装配过程
- 将构造代码与表示代码分开
- 可以对构造过程进行更精细的控制



### 5、单例模式

​	内容：保证一个类只有一个实例，并提供一个访问它的全局访问点。

​	角色：

- 单例（Singleton）

```python
class Singleton:
    def __new__(cls, *args, **kwargs):
        if not hasattr(cls, '_instance'):
            cls._instance = super(Singleton, cls).__new__(cls)
        return cls._instance

class MyClass(Singleton):
    def __init__(self, a):
        self.a = a

a = MyClass(10)
# 不会重新创建实例，但是会重新初始化
b = MyClass(20)
print(id(a), id(b), a.a)
```

​	优点：

- 对唯一实例的受控访问
- 单例相当于全局变量，但防止了命名空间被污染



### 6、总结

1. 抽象工厂模式和建造者模式相比于简单工厂模式和工厂方法模式而言更灵活也更复杂。
2. 通常情况下设计以简单工厂模式或工厂方法模式开始，当你发现设计需要更大的灵活性时，则像更复杂的设计模式演化。



## 三、结构型模式

### 1、适配器模式

​	内容：将一个类的接口转换成客户希望的另一个接口。适配器模式使得**原本由于接口不兼容而不能一起工作的那些类可以一起工作**。

​	两种实现方式：

- 类适配器：使用多继承
- 对象适配器：使用组合

​	角色：

- 目标接口（Target）
- 待适配的类（Adaptee）
- 适配器（Adapter）

```python
class Payment(ABC):
    @abstractmethod
    def pay(self, money): pass
class Alipay(Payment):
    def pay(self, money): pass

# 需要被适配的类（因需求或代码兼容目的产生，但不能直接改，因为可能与高层模块存在耦合）
class BankPay:
    def cost(self, money): pass

# 专用的适配器类，即类适配器（多继承思想），被适配类依然可用原有其他方法
class NewBankPay(Payment, BankPay):
    def pay(self, money): self.cost(money)

p = NewBankPay()
p.pay(100)
```

```python
class Payment(ABC):
    @abstractmethod
    def pay(self, money): pass
class Alipay(Payment):
    def pay(self, money): pass

class BankPay:
    def cost(self, money): pass
class ApplePay:
    def cost(self, money): pass

# 适配多个类的适配器类，即对象适配器（组合思想），被适配类不可用原有其他方法，除非单独配置
class PaymentAdapter(Payment):
    def __init__(self, payment):
        self.payment = payment
    def pay(self, money):
        self.payment.cost(money)

p = PaymentAdapter(ApplePay())
p.pay(100)
```



### 2、桥模式

​	内容：将一个事物的两个维度分离，使其都可以独立变化。

​	角色：

- 抽象（Abstraction）
- 细化抽象（RefinedAbstraction）
- 实现者（Implementor）
- 具体实现者（Concretelmplementor）

​	应用场景：当事物有两个维度上的表现，两个维度都可能扩展时。

```python
# 抽象
class Shape(ABC):
    def __init__(self, color):
        self.color = color
    @abstractmethod
    def draw(self): pass
# 实现
class Color(ABC):
    @abstractmethod
    def paint(self, shape): pass
# 细化抽象
class Circle(Shape):
    name = 'circle'
    def draw(self):
        self.color.paint(self)
# 具体实现
class Blue(Color):
    def paint(self, shape): print('a blue %s' %shape.name)

shape = Circle(Blue())
shape.draw()
```

​	解释：这里的"抽象"，指的并非"抽象类"或"接口"，而是被抽象出来的一套"类库"，它只包含骨架代码，真正的业务逻辑需要委派给定义中的"实现"来完成。而定义中的"实现"，也并非"接口的实现类"，而是的一套独立的"类库"。"抽象"和"实现"独立开发，通过对象之间的组合关系，组装在一起。

​	优点：

- 抽象和实现相分离
- 优秀的扩展能力



### 3、组合模式

​	内容：将对象**组合成树形结构以表示"部分-整体"的层次结构**。组合模式使得用户对单个对象和组合对象的使用具有一致性。

​	角色：

- 抽象组件（Component）
- 叶子组件（Leaf）
- 复合组件（Composite）
- 客户端（Client）

​	适用场景：

- 表示对象的"部分-整体"层次结构（特别是结构是递归的）
- 希望用户忽略组合对象与单个对象的不同，用户统一地使用组合结构中的所有对象

```python
# 抽象组件
class Graphic(ABC):
    @abstractmethod
    def draw(self): pass
# 叶子组件
class Point(Graphic):
    def __init__(self, x, y):
        self.x, self.y = x, y
    def draw(self):
        print('绘制点(%s, %s)' %(self.x, self.y))
class Line(Graphic):
    def __init__(self, p1, p2):
        self.p1, self.p2 = p1, p2
    def draw(self):
        print('绘制线段[(%s, %s), (%s, %s)]' %(self.p1.x, self.p1.y, self.p2.x, self.p2.y))
# 复合组件
class Picture(Graphic):
    def __init__(self, iterable):
        self.children = []
        for g in iterable:
            self.add(g)
    def add(self, graphic):
        self.children.append(graphic)
    def draw(self):
        for g in self.children:
            g.draw()

p1 = Point(2, 3)
l1 = Line(Point(3, 4), p1)
pic1 = Picture([p1, l1])
pic2 = Picture([pic1, Point(5, 6)])
pic2.draw()
```

​	优点：

- 定义了包含基本对象和组合对象的类层次结构
- 简化客户端代码，即客户端可以一致地使用组合对象和单个对象
- 更容易增加新类型的组件



### 4、外观模式

​	内容：为子系统中的一组接口提供一个一致的界面，外观模式定义了一个高层接口，这个接口使得这一子系统更加容易使用。

​	角色：

- 外观（facade）
- 子系统类（subsystem classes）

```python
# 子系统类
class CPU:
    def runCmd(): pass
    def stop(): pass
class Disk:
    def work(): pass
    def close(): pass
class Mem:
    def powerOn(): pass
    def powerOff(): pass
# 外观
class Computer:
    def __init__(self):
        self.cpu, self.disk, self.mem = CPU(), Disk(), Mem()
    def run(self):
        self.cpu.runCmd()
        self.disk.work()
        self.mem.powerOn()
    def stop(self):
        self.cpu.stop()
        self.disk.close()
        self.mem.powerOff()

c = Computer()
c.run()
c.stop()
```

​	优点：

- 减少系统相互依赖
- 提高了灵活性
- 提高了安全性



### 5、代理模式

​	内容：为其他对象提供一种代理以控制对这个对象的访问。

​	应用场景：

- 远程代理：为远程的对象提供代理
- 虚代理：根据需要创建很大的对象
- 保护代理：控制对原始对象的访问，用于对象有不同访问权限时

​	角色：

- 抽象实体（Subject）
- 实体（RealSubject）
- 代理（Proxy）

```python
# 抽象实体
class Subject(ABC):
    @abstractmethod
    def get_content(self): pass
    def set_content(self): pass
# 实体
class RealSubject(Subject):
    def __init__(self, filepath):
        self.filepath = filepath
        with open(filepath) as fp:
            self.content = fp.read()
    def get_content(self): return self.content
    def set_content(self, content):
        with open(filepath, 'w') as fp:
       		fp.write(content)
# 虚代理
class VirtualProxy(Subject):
    def __init__(self, filepath):
        self.filepath = filepath
        self.subj = None
    def get_content(self):
        if not self.subj:
            self.subj = RealSubject()
        return self.subj.get_content()
# 保护代理
class ProtectedProxy(Subject):
    def __init__(self, filepath):
        self.subj = RealSubject(filepath)
    def get_content(self):
        return self.subj.get_content()
    def set_content(self):
        # 这里不一定是拒绝，也可以是验权等操作
        raise PermissionError("Set Permission denied")
```

​	优点：

- 远程代理：可以隐藏对象位于远程地址空间的事实
- 虚代理：可以**进行优化**，例如根据要求创建对象
- 保护代理：允许在访问一个对象时有一些**附加的内务处理**



## 四、行为型模式

### 1、责任链模式

​	内容：使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系。将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。

```python
# 抽象处理者
class Handler(ABC):
    @abstractmethod
    def HandleEvent(self, condition):
        pass
# 具体处理者
class Level_1_Handler(Handler):
    def HandleEvent(self, condition):
        # 本级处理逻辑
        pass
class Level_2_Handler(Handler):
    def __init__(self):
        self.next = Level_1_Handler()
    def HandleEvent(self, condition):
        # 随便给的一个函数，表示本层可以 handle 时，进入这一分支
        if CanHandleEvent(self, condition): 
            # 本级处理逻辑
            pass
        else: 
            self.next.HandleEvent(condition)
    
h = Level_2_Handler()
h.HandleEvent(the_condition)
```

​	角色：

- 抽象处理者（Handler）
- 具体处理者（ConcreteHandler）
- 客户端（Client）



### 2、观察者模式

​	内容：定义对象间的一种一对多的依赖关系，**当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并被自动更新**。观察者模式又称"发布-订阅"模式。

​	角色：

- 抽象主题（Subject）
- 具体主题（ConcreteSubject）—— 发布者
- 抽象观察者（Observer）
- 具体观察者（ConcreteObserver）—— 订阅者

​	适用场景：

- 当一个抽象模型有两方面，其中一个方面依赖于另一个方面。**将这两者封装在独立对象中以使它们可以各自独立地改变和复用**。（主要场景）
- 当对一个对象的改变需要同时改变其它对象，而不知道具体有多少对象有待改变。（客户端后期动态指定通知对象）
- 当一个对象必须通知其它对象，而它又不能假定其它对象是谁。换言之，你不希望这些对象是紧密耦合的。（客户端后期动态指定通知对象）

```python
# 抽象观察者（订阅者）
class Observer(ABC):
    @abstractmethod
    def update(self, notice):
        pass
# 具体观察者
class StatusObserver(Observer):
    def __init__(self):
        # 未绑定观察关系前的初始状态
        self.status = 'the init observer status/data'
    def update(self, subject):
        self.status = subject.status
# 抽象主题（发布者）
class Subject(ABC):
    @abstractmethod
    def attach(self, obs): pass
    @abstractmethod
    def detach(self, obs): pass
    @abstractmethod
    def notify(self): pass
# 具体主题
class RealSubject(Subject):
    def __init__(self, status=None):
        self.observers = []
        self.__status = status
    def attach(self, obs):
        self.observers.append(obs)
        # 绑定时进行一次发布，若不需要，注释该行代码
        self.notify()
    def detach(self, obs):
        self.observers.remove(obs)
    def notify(self):
        for obs in self.observers:
            obs.update(self)
    # 下面使用装饰器，实现对指定私有属性赋值，即刻通知观察者同步值
    # 但在实际情况中，也有可能是发布者某一行为触发观察者另一行为，但把握住方法的核心就好：发布者此时调用自己的 notify() 方法，同时保证观察者需要的发布者属性或方法能被访问到即可（一般比较方便的是传递观察者的对象引用）。
    @property
    def status(self): return self.__status
    @status.setter
    def status(self, new_status):
        self.__status = new_status
        self.notify()

s = RealSubject('the init subject status/data')
a= StatusObserver()
print(a.status)
s.attach(a)
print(a.status)
s.status = 'the changed subject status/data'
print(a.status)
```

​	优点：

- 目标和观察者之间的**抽象耦合最小**
- 支持**广播**通信



### 3、策略模式

​	内容：定义一系列的算法，把它们一个个封装起来，并且使它们可相互替换。本模式使得算法可独立于使用它的客户而变化。

​	角色：

- 抽象策略（Strategy）
- 具体策略（ConcreteStrategy）
- 上下文（Context）

``` python
# 抽象策略
class Strategy(ABC):
    @abstractmethod
    def execute(self, data):
        pass
# 一个策略
class OneStrategy(Strategy):
    def execute(self, data):
        print('使用一个策略解决问题%s' %data)
# 另一个策略
class AnotherStrategy(Strategy):
    def execute(self, data):
        print('使用另一个策略解决问题%s' %data)
# 上下文
class Context:
    def __init__(self, strategy, data):
        self.data = data
        self.strategy = strategy
    def set_strategy(self, strategy):
        self.strategy = strategy
    def do_strategy(self):
        self.strategy.execute(data)

s1 = OneStrategy()
s2 = AnotherStrategy()
data = 'xxxxx'
c = Context(s1, data)
c.do_strategy()
c.set_strategy()
c.do_strategy()
```

​	优点：

- 定义了一系列可重用的算法和行为
- 消除了一些条件语句
- 可以提供相同行为的不同实现

​	缺点：

- 客户必须了解不同的策略



### 4、模板方法模式

​	内容：**定义一个操作中的算法的骨架，而将一些步骤延迟到子类中**。模板方法使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。

​	角色：

- 抽象类（AbstractClass）：定义抽象的原子操作（钩子操作）；实现一个模板方法作为算法的骨架。
- 具体类（ConcreteClass）：实现原子操作

​	适用场景：

- 一次性实现一个算法的不变的部分
- 各个子类中的公共行为应该被提取出来并集中到一个公共父类中以避免代码重复
- 控制子类扩展

```python
# 抽象类
class Window(ABC):
    @abstractmethod
    def start(self): pass
    @abstractmethod
    def repaint(self): pass
    @abstractmethod
    # 原子/钩子操作
    def stop(self): pass
    @abstractmethod
    # 模板方法（不变或必需的操作）
    def run(self):
        self.start()
        while True:
            try:
                self.repaint()
            except KeyboardInterrupt:
                break
        self.stop()
# 具体类
class MyWindow(Window):
    def __init__(self, msg):
        self.msg = msg
    def start(self):
        print("窗口开始运行")
    def stop(self):
        print("窗口结束运行")
    def repaint(self):
        print(self.msg)

MyWindow("Hello World!").run()
```
