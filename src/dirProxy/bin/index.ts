import MainConfig from '../../config/MainConfig';
import HttpTool from '../../http/HttpTool';
import ResURL from '../../_T/ResURL';
import BinTool from './BinTool';
import { join, extname } from 'path';
import { createReadStream, stat } from 'fs';
import mime from 'mime';
import { crossDomainHead } from '../../com/ResHead';
import { AddressInfo } from 'net';
import http from 'http';

/**
 * bin目录代理
 */
export default class BinProxy {
  /**
   * 开始
   * @param srcProxyPort src代理的端口
   * @returns
   */
  static start(srcProxyPort: number) {
    return HttpTool.createServer((req, res) => {
      /**
       * 忽略掉请求后的search和hash值并对特殊字符解码
       * TODO: 这里不处理的话有大问题
       */
      let url = decodeURI(req.url!.replace(/\?.+/, ''));
      switch (req.method) {
        case 'GET':
          //web工具
          switch (true) {
            case new RegExp(`^/${ResURL.publicDirName}`).test(url):
              res.writeHead(200, {
                ...crossDomainHead,
                'Content-Type': mime.getType(extname(url)) + ';charset=UTF-8',
              });
              //提取出相对目录并取出内容
              BinTool.getWebTool(
                url.replace(new RegExp(`^/${ResURL.publicDirName}`), ''),
                srcProxyPort,
              ).then((js) => {
                res.end(js);
              });
              break;
            //主页html文件
            case new RegExp(
              `^(/?|/?${MainConfig.config.homePage.replace(/^\//, '')})$`,
            ).test(url):
              res.writeHead(200, {
                ...crossDomainHead,
                'Content-Type': mime.getType('html') + ';charset=UTF-8',
              });
              BinTool.getHomePage().then((html) => {
                res.end(html);
              });
              break;
            //入口js文件
            case new RegExp(
              `^/?${MainConfig.config.index.js.replace(/^\.\//, '')}$`,
            ).test(url):
              let req1 = http.request(
                {
                  host: HttpTool.getHostname,
                  port: srcProxyPort,
                  path: `/${MainConfig.config.index.ts
                    .replace(/^\.\//, '')
                    .replace(/\.ts$/, '.js')}`,
                  method: 'GET',
                  headers: req.headers,
                },
                (res_) => {
                  res.writeHead(res_.statusCode, {
                    ...crossDomainHead,
                    ...res_.headers,
                  });
                  res_.addListener('data', (_) => {
                    res.write(_);
                  });
                  res_.addListener('end', () => {
                    res.end();
                  });
                },
              );
              req1.end();
              req1.addListener('error', (err) => {
                console.log(`获取代理文件${MainConfig.config.index.ts}出错了`, err);
              });
              break;
            //其他文件
            case true:
              // 直接从bin目录下找
              let _url: string = join(ResURL.binPath, url);
              //判断是否有这个文件
              stat(_url, (err, stats) => {
                if (err || !stats.isFile()) {
                  res.writeHead(404, crossDomainHead);
                  res.end();
                  return;
                }
                res.writeHead(200, {
                  ...crossDomainHead,
                  'Content-Type': mime.getType(extname(url)) || '',
                });
                //
                createReadStream(_url).pipe(res);
              });
              break;
          }
          break;
      }
    }, 0).then((server) => {
      return (server.address() as AddressInfo).port;
    });
  }
}
