/**
 * 配置数据
 */
module.exports = {
  /** 入口 */
  index: {
    /** ts入口地址，相对于项目src目录 */
    ts: 'Main.ts',
    /** js入口地址，相对于项目bin目录 */
    js: 'js/bundle.js',
  },
  /** 主页文件的名字 */
  homePage: 'index.html',
  /** 主机地址，当有任何原因没有自动获取到主机地址时将采用这个地址 */
  hostName: undefined,
  /** 是否打印日志 */
  ifLog: false,
  /** 断点类型 */
  breakpointType: 'browser',
  /** 是否在启动时打开主页 */
  ifOpenHome: true,
  /** 是否立即刷新浏览器 */
  ifUpdateNow: false,
};
