# 魔兽争霸 3 1.27a TypeScripts 开发 模板

该项目模板默认使用者具有 常规的技术使用，接触相关的编程知识。

该项目提供了 KKWE(包含 X_JAPI) 、 w2l(w3x2lni) 环境

构建自动注入 Cheat

wc3ts 提供封装函数使用，对象编程。具体函数使用请参考 wc3ts 相关文档。也可参考 w3ts （重置版本的 ts 文档，但是会少了很多函数）。

wc3ts 目前还在完善中.

KKWE 该项目不一定是最新的，可自行升级 KKWE

## Future(wc3ts and template)

编写依赖架构，集成不同的模块（主要是针对复用较多的）：

1. 属性面板 UI
2. 血条 UI
3. 伤害系统
4. 部分技能系统
5. 热更新
6. excel 物编

## 开发环境

1. KKWE
2. w3x2lni
3. nodejs
4. npm | yarn
5. War3 1.27a

## 项目初始化

`yarn install`
安装项目编译构建所需要的依赖

## 主要项目依赖

1. [@eiriksgata/wc3ts](https://github.com/eiriksgata/wc3ts)
2. luamin
3. ts-node
4. typescript-to-lua

## 编译

命令： `yarn build`
生成的 tstl lua 文件 自动放置于 maps/map/main.lua
编译 打包生成的 文件 位于 dist/map.w3x

## 运行测试

命令： `yarn run test`
编译并且运行 dist/map.w3x 地图

## 更多功能

参考 `package.json` 的 `scripts`

## 目录结构

- `dev_lib` 开发环境库 包含 KKWE 、w2l
- `dist` 编译生成的文件 w3x 地图运行文件
- `maps` w2l lni 项目文件 如果需要 编写地形 可用 该目录下的 .w3x 载入到 kkwe 编辑器中，编辑完成后保存 即可
- `scripts` 脚本文件
- `src` 地图源文件 ，入口文件为 `main.ts`
- `config.json` 配置环境目录

## excel 原生物编（未实现）

- native-object-table.xlsx 该文件为原生物编数据表格，可自行拓展定义的属性。转换本质是将 excel 数据 转为 lni 数据，通过 w3x2lni 打包成地图数据。

通过 nodejs 脚本对 表格转为 lni 数据。

## 自定义框架数据（未实现）

**_该系统需要依赖于框架系统，本质是舍弃了魔兽原生物编定义，舍弃魔兽原生的伤害系统，舍弃原生 UI 等，改为自身实现一套新的系统。该实现依赖于 诸多模块 自己重新实现的模块，例如 游戏伤害系统，单位属性面板 UI，单位自身血条等。_**

- custom-frame-table.xlsx 文件

## AI Agent - Github copilot

- `./github/copilot-instructions.md`

## Welcome PR
