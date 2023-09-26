import * as esbuild from 'esbuild';
import path from 'path';
import ResURL from '../../_T/ResURL';
import MainConfig from '../../config/MainConfig';
import md5 from 'md5';

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
      `./node_modules/.layabox_esbuild_www_${md5(process.cwd())}`,
    );
    let ctx = await esbuild.context({
      ...esbuildOp,
      entryPoints: [path.join(ResURL.srcPath, MainConfig.config.index.ts)],
      outdir,
      bundle: true,
      sourcemap: 'inline',
    });
    // 加监听
    await ctx.watch();
    //
    let { port } = await ctx.serve({
      servedir: outdir,
    });
    return port;
  }
}
