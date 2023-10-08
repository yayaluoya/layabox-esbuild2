import * as esbuild from 'esbuild';
import path from 'path';
import ResURL from '../../_T/ResURL';
import MainConfig from '../../config/MainConfig';
import PackageConfig from '../../config/PackageConfig';
import { ObjectUtils } from '../../../yayaluoya-tool/obj/ObjectUtils';

/**
 * src目录代理
 */
export default class SrcProxy {
  /**
   * 开始
   */
  static async start(esbuildOp: esbuild.BuildOptions = {}) {
    let outdir = path.join(
      ResURL.rootURL,
      `./node_modules/.${PackageConfig.package.name}-${process
        .cwd()
        .replace(/[^\w]/g, '-')}`,
    );
    delete esbuildOp.entryPoints;
    delete esbuildOp.outdir;
    delete esbuildOp.bundle;
    let ctx = await esbuild.context(
      ObjectUtils.merge(
        {
          entryPoints: [path.join(ResURL.srcPath, MainConfig.config.index.ts)],
          outdir,
          bundle: true,
          sourcemap: 'inline',
          loader: {
            /** 普通文本 */
            '.txt': 'text',
            /** layabox的shader */
            '.fs': 'text',
            '.vs': 'text',
          },
        } as esbuild.BuildOptions,
        esbuildOp,
      ),
    );
    // 加监听
    await ctx.watch();
    //
    let { port } = await ctx.serve({
      servedir: outdir,
    });
    return port;
  }
}
