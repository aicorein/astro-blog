---
title: "Vuex 学习笔记"
published: 2022-08-01
description: "Vuex 是实现组件全局状态（数据）管理的一种方式"
tags: [vue, vuex, nodejs, html, javascript, css]
category: computer-science
permalink: "vuex-learn"
pinned: false
image: "https://api.anosu.top/img/?sort=pc&size=mw1920"
licenseName: "CC BY-SA 4.0"
author: "律回"
draft: false
---

# Vuex 学习笔记

本文以适用于 Vue3 的 Vuex4 为例。

## 一、Vuex 是什么

​Vuex 是实现组件全局状态（数据）管理的一种机制，可以方便的实现组件之间数据的共享。

​好处：
- 能够在 vuex 中集中管理共享的数据，易于开发和后期维护
- 能够高效地实现组件之间的数据共享，提高开发效率存储
- 在 vuex 中的数据都是响应式的，能够实时保持数据与页面的同步
​
注：一般情况下，只有组件之间共享的数据，才有必要存储到 vuex 中；对于组件中的私有数据，依旧存储在组件自身的 data 中即可。

## 二、Vuex 核心概念

### 1、state

​state 提供唯一的公共数据源，所有共享的数据都要统一放到 store 的 state 中进行存储。

```js
import { createStore } from 'vuex'
 
export default createStore({
    state: () => ({
        count: 0;
    })
})
```

​ 组件中访问 state 中数据的方式：

```js
this.$store.state.全局数据名
```

​ 按以下方式，可以绑定到计算属性上：

```js
computed(){
    count(){
        return this.$store.state.count;
    }
}
```

​ 但过于冗余，可以用 mapState 简化操作：

```js
import { mapState } from 'vuex'
 
computed: {
    ...mapState(['count'])
}
```

### 2、mutations
​
mutation用于变更 store 中的数据。

只能通过 mutation 变更 store 数据，不可以直接操作 store 中的数据。通过这种方式虽然操作起来稍微繁琐一些，但是可以集中监控所有数据的变化。store.js 中：

```js
import { createStore } from 'vuex'
 
export default createStore({
    state: () => ({
        count: 0;
    }),
    mutations: {
        // 传递参数
        add(state, step) {
            state.count += step;
        }
    }
})
```

​组件中触发：

```js
methods: {
    handle1() {
        this.$store.commit('add', 2);
    }
}
```

​也可以使用 mapMutations 触发 mutations，映射为方法：（更简洁）

```js
import { mapMutations } from 'vuex'
 
methods: {
    ...mapMutations(['add', 'addN'])
}
```

​注：不要在 mutations 中执行异步操作，会导致调试器数据不同步！

### 3、actions
​actions 用于处理异步任务。

​如果通过异步操作变更数据，必须通过 actions，而不能使用 mutations，但是在 actions 中还是要通过触发 mutations 的方式间接变更数据。

```js
const store = createStore({
    mutations: {
        add(state) {
            state.count++;
        }
    },
    actions: {
        addNAsnyc(context, step) {
            // 携带参数
            setTimeout(() => {
                context.commit('addN', step);
            }, 1000)
        }
    }
})
```

​ 触发：

```js
methods: {
    handle() {
        this.$state.dispatch('addAsync', 5);
    }
}
```

​同样地，我们也可以用 mapActions 映射其到方法：

```js
import { mapActions } from 'vuex'
 
methods: {
    ...mapActions(['addAsync', 'addNAsync']);
}
```

### 4、getters

​getters 用于对 store 中的数据进行加工处理形成新的数据。

getters 可以对 store 中已有的数据加工处理之后形成新的数据，类似计算属性。store 中数据发生变化，getters 的数据也会跟着变化。

```js
const store = createStore({
    state: () => ({
        count: 0;
    }),
    getters: {
        showNum: state => {
            return `当前最新数量值：${state.count}`;
        }
    }
})
```

​使用：

```js
this.$store.getters.showNum
```

​映射至计算属性：

```js
import { mapGetters } from 'vuex'
 
computed: {
    ...mapGetters(['showNum'])
}
```

### 5、modules

​业务逻辑不复杂时用不到。参见：https://vuex.vuejs.org/zh/guide/modules.html
