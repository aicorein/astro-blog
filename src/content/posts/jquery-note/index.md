---
title: "jQuery 常用方法"
published: 2021-11-01
description: "jQuery —— 前端使用最为广泛的 JS 库"
tags: ["javascript", "jquery"]
category: "computer-science"
pinned: false
image: "https://miku.top/[dyn-img]"
licenseName: "CC BY-SA 4.0"
author: "律回"
draft: false
---

## jQuery

#### 1、javascript 库

​	javascript 库即 library，是一个封装好的特定的集合（方法和函数）。从封装一大堆函数的角度理解库，就是在这个库中，封装了许多预先定义好的函数。

​	常见的 javascript 库：

- jQuery
- Prototype
- YUI
- Dojo
- Ext js
- 移动端的 zepto



#### 2、jQuery概述

​	优点：轻量，跨浏览器兼容，链式编程、隐式迭代，扩展性强等。



#### 3、jQuery 入口函数

​	等待页面 DOM 加载完毕再执行 js 代码，相当于原生 js 中的 `DOMContentLoaded`

```js
$(document).ready(function() {
    ...
})

// 或

$(function() {
    ...
})
```



#### 4、jQuery 顶级对象

​	（1）\$ 是 jQuery 的别称，在代码汇总可以使用 jQuery 代替 \$

​	（2）\$ 是 jQuery的顶级对象，相当于原生 js 中的 window



#### 5、jQuery 对象和 DOM 对象

​	DOM 对象：用原生 js 获取的对象

​	jQuery对象：用 jQuery 获取的对象，本质是对 DOM 对象的封装

​	注：**两种不同的对象只能使用各自对应的属性和方法**



#### 6、jQuery 对象和 DOM 对象的互相转化

```js
var div = document.querySelector('div');
$(div).hide();	// 此时就已经转化为 jQuery 对象


// 使用索引转化为 DOM 对象
$('video')[0].play();
$('video').get(0).play();
```



#### 7、jQuery 基本和层级选择器

```js
$('选择器') // 填入 CSS 选择器即可
```



#### 8、jQuery 隐式迭代

​	遍历内部 DOM 元素（伪数组存储）的过程就叫做**隐式迭代**。

​	简单理解：给匹配到的所有元素进行循环遍历，执行相应的方法，而不用手动再进行循环，简化我们的操作，方便我们调用。

```js
// 使用 jq 获取多个 div 元素
var divs = $('div');

// 将它们的背景都设为天蓝色，这里就是隐式迭代
divs.css('background', 'pink');
```



#### 9、jQuery 筛选选择器

| 语法       | 用法                 | 描述                                                   |
| ---------- | -------------------- | ------------------------------------------------------ |
| \:first     | `$('li:first')`      | 获取第一个 li 元素                                     |
| \:last      | `$('li:last')`       | 获取最后一个 li 元素                                   |
| \:eq(index) | `$('li:eq(index)')`  | 获取到的 li 元素中，选择索引为 2 的元素，索引从 0 开始 |
| \:odd       | `$('li:odd')`        | 获取到的 li 元素中，选择索引号为奇数的元素             |
| \:even      | `$('li:even')`       | 获取到的 li 元素中，选择索引号为偶数的元素             |
| \:checked   | `$('input:checked')` | 获取到的 input 元素中，选择被选择的表单元素            |



#### 10、jQuery 筛选方法

| 语法                  | 用法                             | 说明                                                  |
| --------------------- | -------------------------------- | ----------------------------------------------------- |
| `parent()`            | `$('li').parent()`               | 查找父级                                              |
| `children(selector)`  | `$('li').children()`             | 相当于$('ul>li')，最近一级                            |
| `find(selector)`      | `$('ul').find('li')`             | 相当于$('ul li')，后代选择器                          |
| `siblings(selector)`  | `$('.first').siblings('li')`     | 查找兄弟节点，不包括自己                              |
| `nextAll([selector])` | `$('.first').nextAll()`          | 查找当前元素之前的同辈元素                            |
| `prevAll([selector])` | `$('.last').prevAll()`           | 查找当前元素之后的同辈元素                            |
| `hasClass(className)` | `$('div').hasClass('protected')` | 检查当前的元素是否含有某个特定的类，如果有，返回 true |
| `eq(index)`           | `$('li').eq(2)`                  | 相当于$('li:eq(2)')                                   |
| `parents()`           | `$('div').parents()`             | 返回指定选择器条件的父级，无参数返回所有父级          |

​	注：更推荐使用 `eq(index)` 的写法，因为 index 为变量时不需要字符串转化

​	注：**获取元素当前索引号可使用 `$(this).index()`**



#### 11、jQuery 链式编程

```js
$(this).css('color', 'blue');
$(this).siblings().css('color', '');

// 可简写为：

$(this).css('color', 'blue').siblings().css('color', '');
```



#### 12、jQuery 样式操作

##### （1）操作 CSS 方法

```js
// 参数只写属性名，则返回值
returnVal = $(this).css('color');

// 参数是属性名，属性值；则是设置属性
$(this).css('color', 'blue');

// 参数可以是对象形式，可设置多组样式
$(this).css({
    backgroundColor: "skyblue",
    "font-size": "20px",
    width: 200,
    height: 200,
})
```

##### （2）设置类样式

```js
$('div').addClass('current');		// 添加类名

$('div').removeClass('current');	// 删除类名

$('div').toggleClass('current');	// 切换类，无则添加，有则删除
```

​	注：jQuery 的类操作与原生 JS 的不同在于：**只是对指定类操作，不会影响其他类名**



#### 13、jQuery 效果

##### （1）显示隐藏效果

```js
// 显示效果语法规范，其他类似
$('div').show([speed, [easing], [callback]]);

...
$('div').hide(...)
$('div').toggle(...)
```

​		注：参数都可省略，即无动画直接显示

​			a. speed：三种预定速度之一的字符串（"show"，"normal"，"fast"）或动画时长的毫秒数值（如：1000）

​			b. easing：（Optional）用来指定切换效果，默认为 "swing"，可用参数 "linear"

​			c. callback：回调函数，动画完成时执行的函数，每个元素执行一次。



##### （2）滑动效果

```js
$('div').slideUp(speed, callback);

...
$('div').slideDown(speed, callback);
$('div').slideToggle(speed, callback);

// 参数含义与显示隐藏效果类似
```



##### （3）事件切换

```js
// 此时经过触发 fn1, 离开触发 fn2
$('div').hover(fn1, fn2);

// 此时经过和离开都只触发 fn
$('div').hover(fn);
```



##### （4）停止动画排队函数

​	a. 动画或动画队列及其停止排队方法

​			动画或者效果一旦触发就会执行，如果短时间内触发多个动画或效果，将会造成它们的同时执行。

​			解决方法：

```js
$('div').stop()...[后面跟动画效果]

// ep:
$('div').hover(function() {
    $(this).children('ul').stop().slideToggle(200);
})
```

​			关于 `stop()` 函数：

| 参数      | 描述                                                         |
| --------- | ------------------------------------------------------------ |
| *stopAll* | 可选。规定是否停止被选元素的所有加入队列的动画。             |
| *goToEnd* | 可选。规定是否允许完成当前的动画。该参数只能在设置了 stopAll 参数时使用。 |

​			对应四种情况：

​				`stop(true)`等价于`stop(true,false)`:  停止被选元素的所有（包括当前动画）加入队列的动画。

​				`stop(true,true)`:  停止被选元素的所有加入队列的动画，但允许完成当前动画。

​				`stop()`等价于`stop(false,false)`:  停止被选元素当前的动画，但允许完成以后队列的所有动画。

​				`stop(false,true)`:  立即结束***当前的动画*** 到最终效果，然后完成***以后队列*** 的所以动画。



##### （5）淡入淡出效果

```js
fadeIn([speed, easing], [callback]);
fadeOut(...);
fadeToggle(...);

fadeTo([speed], opacity, [easing], [callback]);
```



##### （6）自定义动画效果

```js
animate(params, [speed], [easing], [callback]);

// 示例：
$('div').animate({
    left: 200px,
    right: 100px
}, fast, linear)
```

​	参数说明： `params`：想要更改的样式属性，必须写，以对象形式传递。符合属性使用驼峰命名法。

​		其他参数类似上面的函数。



#### 14、jQuery 属性操作

```js
// 获取固有属性或设置
$('div').prop('width');
$('div').prop('width', 200);

// 获取自定义属性值
$('div').attr('index');
$('div').attr('index', 2);

// 设置元素数据缓存，注意数据缓存是不在 DOM 树中体现的
$('div').data('name', 'melodyEcho');

// 获取元素 h5 新 data 类属性
// 如获取 属性 data-index:
$('div').data('index');
```



##### 15、jQuery 获取内容文本值

```js
// 获取设置元素内容，类似 innerHTML
$('div').html();
$('div').html('<a href="example.com">点击</a>')

// 获取设置元素文本内容，类似 innerText()
$('div').text();
$('div').text('只是一段文本内容');

// 获取设置表单值
$('input').val();
$('input').val(32);
```



#### 16、jQuery 元素操作

##### 	（1）jQuery 遍历对象 each 方法

```js
// 写法
$('div').each(function(index, domEle) { xxx; });


// 示例：
var colorArr = ['red', 'green', 'blue'];
$('div').each(function(i, domEle) {
    console.log(i);	// 打印索引
    
    // 注意返回的是 dom 对象，要进行转化
    $(domEle).css('color', arr[i]);
})
```



##### 	（2）jQuery 遍历处理数据

​			`$.each()` 主要用于遍历元素中的数据值，如获取数组或对象中的数据

```js
// 写法
$.each(object, function(index, element) { xxx });

// 示例：
// 遍历数组：
arr = [1, 2, 3]
$.each(arr, function(i , val) {
    console.log(i);
    console.log(val);
})
// 遍历对象：
$.each({
    name: "melodyEcho",
    age: 18
}), function(i, val) {
    console.log(i);		// 输出属性名
    console.log(val);	// 输出属性值
}

```



##### （3）创建、添加和删除元素

```js
// 创建元素
var span = $('<span>创建的一个 span 元素</span>');
var p = $('<p>创建的 p 元素</p>');

/* 添加元素 */
// 内部添加
$('div').append(span, p);
$('div').prepend(span, p);

// 外部添加（同级）
$('div').before(p, span);
$('div').after(p, span);

// 删除元素
$('div').remove();
$('ul').empty()		// 删除内部所有子节点
$('ul').html('');	// 也是删除内部所有子节点
```



#### 17、jQuery尺寸、位置操作

##### （1）尺寸

| 语法                                 | 用法                       |
| ------------------------------------ | -------------------------- |
| width() / height()                   | 只计算 width、height       |
| innerWidth() / innerHeight()         | 含 padding                 |
| outerWidth() / outerHeight()         | 含 padding、border         |
| outerWidth(true) / outerHeight(true) | 含 padding、border、margin |



##### （2）位置

​		**1. Offset 方法**

```js
$('div').offset();

$('div').offset({
    top: 10,
    left: 30
})
```

​	注：a. offset() 方法设置或返回被选元素相对于文档的偏移坐标，跟父级没有关系

​			b. 该方法有 2 个属性：left、top，可直接使用 `offset.top()` 或 `offset.left()`

​			c. 可用于设置元素偏移



​		**2. position 方法**

```js
$('div').position();
```

​	注：a. 用于返回被选择元素相对于带有定位的父级偏移坐标

​			b. **不能用于设置偏移**



​		**3. scrollTop、scrollLeft 方法**

```js
console.log(window.scrollTop());
```



#### 18、jQuery 事件

##### （1）事件注册

​		1. 单个事件注册方式：

```js
// 这种方式一次只能注册一个事件
$('div').click(function() {
    $(this).css('backgroundColor', 'skyblue');
})
```

​		

​		**2. 使用 on() 方法**

```js
$('div').on(events, [selection], fn);
```

​		`events`：一个或多个事件分隔的事件类型，如 "click keydown"

​		`selector`：元素的子元素选择器

​		`fn`：回调

```js
// 传入对象参数
$('div').on({
    mouseenter: function() {
        $(this).css('background', 'skyblue');
    },
    click: function() {
        $(this).css('background', 'pink');
    }
})

// 普通方式
$('div').on('mouseenter click', function() {
    $(this).toggleClass('current');
})
```

​		使用 on 方法实现事件委派（委托）：

```js
// 注意：事件绑定在了 ul 上，由 li 来冒泡触发
$('ul').on('click', 'li', function() {
    alert('你点击了 li!')
})
```

​		使用 on 方法的事件委派，可对后来动态添加元素绑定事件

```js
// 后来动态添加的 li 依然可以触发事件
$('ol').on('click', 'li', function() {
    alert('你点击了 li!')
})
$('ol').append($('<li>一个 li 元素</li>'));
```

​		综上：on 方法的优势：**可实现对多个事件响应的统一定义，可实现事件委派，又可通过事件委派来实现动态元素的事件。**



##### （2）事件解绑

​		使用 off() 方法

```js
$('p').off();			// 解绑所有事件处理程序
$('p').off('click');		// 解绑点击事件
$('p').off('click', foo)	// 移除指定侦听函数的事件
$('ul').off('click', li)	// 解除以 ul 委托的，li 的事件
```



​		事件若只触发一次，可使用 one() 方法

```js
$('p').one('click', function() {
    alert('Hello World!')
})
```

