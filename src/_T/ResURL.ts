import path, { join, resolve } from 'path';

/**
 * 资源路径类
 */
export default class ResURL {
  /** 工具根路径 */
  static get rootURL(): string {
    return resolve(__dirname, '../../');
  }

  /** public路径 */
  static get publicURL(): string {
    return join(this.rootURL, '/public/');
  }

  /** 执行目录 */
  static get cwdUrl(): string {
    return process.cwd();
  }

  /** 项目bin目录 */
  static get binPath() {
    return path.join(ResURL.cwdUrl, './bin');
  }
  /** 项目src目录 */
  static get srcPath() {
    return path.join(ResURL.cwdUrl, './src');
  }

  /** 获取public路径下代码的路径 */
  static get publicSrcURL(): string {
    return join(this.publicDirName, `/dist/`);
  }
  /** 获取public路径下资源的路径 */
  static get publicResURL(): string {
    return join(this.publicDirName, '/res/');
  }

  /** 公共目录名称 */
  static get publicDirName(): string {
    return '_⚙️leb2';
  }
}
