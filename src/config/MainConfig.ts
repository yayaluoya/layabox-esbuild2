import IConfig from './IConfig';
import { getAbsolute } from '../_T/getAbsolute';
import { ObjectUtils } from '../../yayaluoya-tool/obj/ObjectUtils';

/**
 * 主配置文件
 */
export default class MainConfig {
  /** 当前的配置 */
  static config: IConfig;

  /**
   * 处理配置文件
   * @param c
   */
  public static handleConfig(c: IConfig): IConfig {
    //相对路径转绝对路径
    c.index.ts = getAbsolute(c.index.ts);
    c.index.js = getAbsolute(c.index.js);
    //
    return c;
  }

  /**
   * 合并配置文件
   * @param c
   * @param cs
   * @returns
   */
  public static merge(c: IConfig, ...cs: Partial<IConfig>[]): IConfig {
    return ObjectUtils.merge(c, ...(cs as any));
  }
}
