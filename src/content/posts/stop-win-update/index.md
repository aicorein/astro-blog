---
title: "彻底停止 windows 更新"
published: 2022-07-22
description: "介绍彻底停止 win11 更新的方法"
tags: ["windows"]
category: computer-science
permalink: "stop-win-update"
pinned: false
image: "https://api.anosu.top/img/?sort=pc&size=mw1920"
licenseName: "CC BY-SA 4.0"
author: "律回"
draft: false
---

# 彻底停止 windows 更新

## 一、现状

:::tip
本文于 2022 年发布，具体方法是否依然适用请多加鉴别。
:::

:::tip
本文章方法适用于将 win11 停止更新。win10 停止更新老方法依旧有效，请自行上网搜索。
​从 win 11 开始，系统的更新机制就变得更加变态。过去常用的组策略禁用和注册表大法都不好使了。因为与 Windows 更新相关的服务更多了，也出现了专门防止自动更新功能被篡改、修正自动更新的机制。
:::


## 二、方法

:::tip
如果你的系统是预览版，而不是正式版，不推荐停止更新。因为预览版都是有使用时限的，长时间不更新，超过时限系统将无法正常使用，俗称"定时炸弹"。另外由于系统更新组件和微软商店的组件是集成的，所以停止系统更新，可能会造成微软商店软件下载、更新功能的异常。
:::

:::warning
以下的操作将涉及对系统文件的修改，你应当理解这些操作是极具危险性的。在进行操作前，建议进行数据备份和全量注册表备份。（当然你不备份也行，一般不容易出问题，但不保证...）
:::

### 1、NSudoLG 工具提权
​ 
我们后面需要操作系统文件，因此要先提升权限。这里我们使用 Nsudo工具进行权限提升。它可以 System 或 TrustedInstaller 的权限运行命令。项目地址：https://github.com/M2TeamArchived/NSudo

​解压后，进入 NSudo Launcher/x64，启动 NSudoLG.exe：

​进入程序后，用户选择 TrustedInstaller，并选择命令提示符，点击运行。


### 2、停止服务
​在命令提示符窗口输入 services.msc 回车（可能需要稍微等几秒），随后弹出服务组件管理的窗口。按照顺序依次选中，右键停止以下三个服务：（若已经停止则为灰色）
- Windows 更新医生服务
- 更新 Orchestrator 服务
- Windows 更新

### 3、注册表备份

:::warning
前面说的全量注册表备份是可选项，但这里的注册表备份请一定要做。如果不做备份，很容易导致后期注册表被杀毒软件识别为无效注册表项误删！
:::

​在刚才打开的命令提示符窗口输入：regedit，然后在地址栏输入：`HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services` 后回车。

​ 再点击 文件 -> 导出，导出注册表备份文件。（名字和路径自己决定）

### 4、移除更新组件

​回到命令提示符窗口，依次运行命令移动更新组件的几个关键 dll 和 exe：（也可以先写成一个 bat，再执行）。建议写命令时，目录后加 `\`，如：`D:\dll_backup\`。 防止写错路径造成文件覆盖。

```bat
move C:\windows\system32\SIHClient.exe D:\update_comp_backup\
move C:\windows\system32\UsoClient.exe D:\update_comp_backup\
move C:\windows\system32\usosvc.dll D:\update_comp_backup\
move C:\windows\system32\WaaSMedicAgent.exe D:\update_comp_backup\
move C:\windows\system32\WaaSMedicSvc.dll D:\update_comp_backup\
move C:\windows\system32\wuauclt.exe D:\update_comp_backup\
move C:\windows\system32\wuaueng.dll D:\update_comp_backup\
move C:\windows\system32\wuauserv.dll D:\update_comp_backup\
```

​ 后面的 `D:\dll_backup\` 是我新建的一个目录。你可以自己新建一个目录（名称随意），用来保存移出的文件，方便后面需要恢复更新功能时，再进行还原。


### 5、检查是否成功
​ 
打开系统更新界面，出现转圈圈或显示未知错误即表明更新已被停止。


## 三、恢复
​ 
若出现问题，或需要恢复更新功能，可进行以下操作。

### 1、注册表恢复
​ 
如果服务项对应注册表被误删或无故消失，但又需要恢复，那就双击我们之前生成的注册表备份文件，进行还原。

### 2、更新功能恢复
​
如果需要重新启用更新、或使用微软商店的软件下载和更新功能，可运行以下命令将所有组件复位：

```bat
move D:\update_comp_backup\* C:\windows\system32
```

​ `D:\update_comp_backup\` 对应你自己创建的目录。