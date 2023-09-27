import { BuildOptions } from 'esbuild';

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
   * plugins https://esbuild.github.io/plugins/
   * ...
   */
  esbuild?: Pick<BuildOptions, 'loader'>;
}

/**
 * 获取默认配置
 * @returns
 */
export function getDefConfig(): IConfig {
  return {
    index: {
      ts: 'Main.ts',
      js: 'js/bundle.js',
    },
    homePage: 'index.html',
    ifLog: false,
    ifOpenHome: true,
    ifUpdateNow: false,
    esbuild: {
      loader: {
        /** 普通文本 */
        '.txt': 'text',
        /** layabox的shader */
        '.fs': 'text',
        '.vs': 'text',
      },
    },
  };
}
