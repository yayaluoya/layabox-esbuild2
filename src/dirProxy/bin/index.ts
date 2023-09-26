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
   */
  public static start(srcProxyPort: number) {
    // req 请求， res 响应
    return HttpTool.createServer((req, res) => {
      //忽略掉请求后的search和hash值并对特殊字符解码
      let url: string = decodeURI(req.url!.replace(/\?.+/, ''));
      //判断请求类型
      switch (req.method) {
        //get请求
        case 'GET':
          //web工具脚本
          if (new RegExp(`^/${ResURL.publicDirName}`).test(url)) {
            res.writeHead(200, {
              ...crossDomainHead,
              'Content-Type': mime.getType(extname(url)) || '',
            });
            //提取出相对目录并取出内容
            BinTool.getWebTool(
              (url as string).replace(new RegExp(`^/${ResURL.publicDirName}`), ''),
              srcProxyPort,
            ).then((_js) => {
              res.end(_js);
            });
          }
          //其他内容
          else {
            switch (true) {
              //主页html文件
              case new RegExp(
                `^((/?)|(/?${MainConfig.config.homePage.replace(/^\//, '')}))$`,
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
                `^/?${MainConfig.config.index.js.replace(/^\//, '')}$`,
              ).test(url):
                http
                  .request(
                    {
                      host: HttpTool.getHostname,
                      port: srcProxyPort,
                      path: `/${MainConfig.config.index.ts.replace(/\.ts$/, '.js')}`,
                      method: 'GET',
                    },
                    (res_) => {
                      res.writeHead(res_.statusCode, {
                        ...crossDomainHead,
                        'Content-Type': mime.getType('js') + ';charset=UTF-8',
                        ...res_.headers,
                      });
                      res_.addListener('data', (_) => {
                        res.write(_);
                      });
                      res_.addListener('end', () => {
                        res.end();
                      });
                      res_.addListener('error', (e) => {
                        console.log(`获取代理${MainConfig.config.index.ts}出错了`, e);
                      });
                    },
                  )
                  .end();
                break;
              //其他文件
              case true:
                //
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
          }
          break;
      }
    }, 0).then((server) => {
      return (server.address() as AddressInfo).port;
    });
  }
}
