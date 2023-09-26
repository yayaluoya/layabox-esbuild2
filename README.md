# Layabox-esbuild2

[![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/layabox-esbuild2
[npm-url]: https://npmjs.org/package/layabox-esbuild2

## 介绍

- #### 使用 esbuild 来增量构建 layabox 项目 修改代码后立即就能看到效果 提高开发速度，优化开发体验。
- #### 视频介绍：https://www.bilibili.com/video/BV16w411R7ZT?share_source=copy_web
- 有问题加 qq 群 <img src="./res/qq.png">

---

## 关于 esBuild

- <a href="https://github.com/evanw/esbuild/">esbuild</a> 是一个用 Go 语言编写的用于打包，压缩 Javascript 代码的工具库。它最突出的特点就是速度极快，下图是 esbuild 跟 webpack, rollup, Parcel 等打包工具打包效率的一个比较:

  <img src="./res/contrast.png">
  图片取自 <a href="https://github.com/evanw/esbuild/">esbuild Github 仓库</a>。

  为什么它能做到那么快？

  它是用 Go 语言编写的。
  该语言可以编译为本地代码解析，生成最终打包文件和生成 source maps 的操作全部完全并行化，无需昂贵的数据转换，只需很少的几步即可完成所有操作。
  该库以提高编译速度为编写代码时的第一原则，并尽量避免不必要的内存分配。
  更多详细介绍，详见 Breword 翻译的 <a href="https://www.breword.com/evanw-esbuild">esbuild 官方文档</a>;

## 对比其它工具

| 工具类型     |                       简介                       | 修改代码后需要等多久才能刷新浏览器并看到修改后的效果 | 是否支持断点调试 |   推荐度   |
| :----------- | :----------------------------------------------: | :--------------------------------------------------: | :--------------: | :--------: |
| layaAir      |                   手动点击编译                   |                      一年，很慢                      |      不支持      | 强烈不推荐 |
| layaair2-cmd |        跟第一步差不多，就是加了个自动编译        |                       半年，慢                       |       支持       |   不推荐   |
| webpack      | 自动编译，功能强大，但是项目比较大的话还是会很慢 |                      一天，稍快                      |       支持       |    推荐    |
| **本工具**   |        自动构建，不编译，项目再大都没影响        |  0 秒，飞快，切换到浏览器刷新的速度有多快它就有多快  |       支持       |  强烈推荐  |

## 安装

- npm 安装。

  `npm i layabox-esbuild2 -g` 注意是全局安装，安装一次就行了。

## 命令

  <img src="./res/order.png">

- `layabox-esbuild2 -i`

  - 在执行目录下初始化配置文件，内容是默认的配置内容。

- `layabox-esbuild2 -s` || `layabox-esbuild2`

  - 直接开始构建项目，当看到如下输出时就说明跑起来了，局域网主页不固定，这里只是实例，本地主页更快的原因是使用 service worker 在浏览器和服务器之间加了一层缓存，所以建议开发时用这个地址。

      <img src="./res/home.png">

- `layabox-esbuild2 -c <url>`

  - 指定配置文件来构建项目，不推荐使用，建议使用 `-i` 选项在当前目录下生成一个配置文件然后在这个配置文件的基础上进行配置。
  - 在项目根目录下创建 layaboxEsbuildConfig.js [位置，名字都可以随便，执行命令时参数填对就行了] 文件，然后导出一个满足 IConfig 接口的对象就行了

  - 然后执行 `layabox-esbuild2 -c ./layaboxEsbuildConfig.js` 就可以以指定配置文件来构建项目了。

- `layabox-esbuild2 --log-config [url]`

  - 查看配置文件，如果不带后面的 url 参数则会打印默认的配置数据。

- layabox-esbuild2 还有快捷指令为 `leb2` 把上面的命令中的 `layabox-esbuid2` 替换掉即可。

## 全部配置选项

```javascript
/**
 * 配置表接口
 */
export default interface IConfig {
    /** 入口 */
  index: {
    /** ts入口地址，相对于项目src目录 */
    ts: string;
    /** js入口地址，相对于项目bin目录 */
    js: string;
  };
  /** 主页文件的名字 */
  homePage: string;
  /** 主机地址，当有任何原因没有自动获取到主机地址时将采用这个地址 */
  hostName?: string;
  /** 是否打印日志 */
  ifLog: boolean;
  /** 是否在启动时在浏览器打开主页 */
  ifOpenHome: boolean;
  /** 有更新时是否立即刷新浏览器 */
  ifUpdateNow: boolean;
  /**
   * esbuild的配置
   * loader https://esbuild.github.io/api/#loader
   */
  esbuild?: Pick<BuildOptions, 'loader'>;
}
```

#### 最后奉上项目测试页面截图

<img src="./res/test.png">

当项目内容有更新时就会出现一个弹出提示项目有更新点击相关按钮就可以更新页面，当从编辑器切换到浏览器时如果触发了浏览器的获取焦点事件就能自动更新，是不是很方便呢。
