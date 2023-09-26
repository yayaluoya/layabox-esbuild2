import Tool from '../_T/Tool';

type webToolJsName = {
  /** 主脚本 */
  main: string;
  /** css内容 */
  css: string;
  /** web加载工具脚本 */
  load: string;
  /** alert工具 */
  alert: string;
};

/**
 * PublicConfig
 */
export default class PublicConfig {
  /**
   * web工具脚本
   */
  static webToolJsName: webToolJsName = {
    main: 'main.js',
    css: 'webTool.css',
    load: 'loadTool.js',
    alert: 'alertTool.js',
  };

  /**
   * web工具脚本唯一key
   */
  static webToolJsOnlyKey: webToolJsName = {
    main: `${Date.now()}_1_${Tool.getRandomStr()}`,
    css: `${Date.now()}_3_${Tool.getRandomStr()}`,
    load: `${Date.now()}_4_${Tool.getRandomStr()}`,
    alert: `${Date.now()}_5_${Tool.getRandomStr()}`,
  };
}
