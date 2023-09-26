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
  /** 断点类型 */
  breakpointType: 'vscode' | 'browser';
  /** 是否在启动时打开主页 */
  ifOpenHome: boolean;
  /** 是否立即刷新浏览器 */
  ifUpdateNow: boolean;
}
