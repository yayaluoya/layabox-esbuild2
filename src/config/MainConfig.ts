import IConfig from './IConfig';
import { ObjectUtils } from '../../yayaluoya-tool/obj/ObjectUtils';

/**
 * 主配置文件
 */
export default class MainConfig {
  /** 当前的配置 */
  static config: IConfig;

  /**
   * 合并配置文件
   * @param c
   * @param cs
   * @returns
   */
  static merge(c: IConfig, ...cs: Partial<IConfig>[]): IConfig {
    return ObjectUtils.merge(c, ...(cs as any));
  }
}
