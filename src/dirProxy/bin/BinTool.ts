import MainConfig from '../../config/MainConfig';
import HttpTool from '../../http/HttpTool';
import ResURL from '../../_T/ResURL';
import { join } from 'path';
import { readFile } from 'fs';
import TemplateT from '../../_T/TemplateT';
import PackageConfig from '../../config/PackageConfig';
import PublicConfig from '../../config/PublicConfig';

/**
 * bin目录工具
 */
export default class BinTool {
  /**
   * 获取web工具内容
   * @param _url
   * @param resProxyPort
   * @returns
   */
  static getWebTool(_url: string, resProxyPort: number): Promise<string> {
    return new Promise<string>((r) => {
      let _jsUrl: string = join(ResURL.publicURL, _url);
      readFile(_jsUrl, (err, data) => {
        if (err) {
          r(`没有找到web工具脚本,${_jsUrl}')`);
          return;
        }
        let _content: string = data.toString();
        //根据不同文件做不同操作
        switch (true) {
          //主脚本要替换版本，和包信息
          case new RegExp(`${PublicConfig.webToolJsName.main}$`).test(_url):
            //进过序列化后的字符串必须对"进行转义处理
            _content = TemplateT.ReplaceVariable(_content, {
              ifUpdateNow: Boolean(MainConfig.config.ifUpdateNow).toString(),
              esbuildE: `http://${HttpTool.getHostname}:${resProxyPort}/esbuild`,
              packageJson: JSON.stringify({
                name: PackageConfig.package.name,
                version: PackageConfig.package.version,
                authorName: PackageConfig.package.authorName,
                description: PackageConfig.package.description,
                repository: PackageConfig.package.repository,
              }).replace(/"/g, '\\"'),
            });
            break;
        }
        //
        r(_content);
      });
    });
  }

  /**
   * 获取主页代码
   */
  static getHomePage(): Promise<string> {
    return new Promise<string>((r) => {
      let _html: string;
      let _htmlUrl: string = join(ResURL.binPath, MainConfig.config.homePage);
      readFile(_htmlUrl, (err, data) => {
        if (err) {
          r('没有找到主页html文件' + _htmlUrl);
          return;
        }
        _html = data.toString();
        //在头部结束时加上css样式表和serviceWorkers工具脚本
        _html = _html.replace(
          /\<\/head\>/,
          `
<link rel="stylesheet" type="text/css" href="${ResURL.publicResURL}${PublicConfig.webToolJsName.css}?q=${PublicConfig.webToolJsOnlyKey.css}">
<script type="text/javascript" src="${ResURL.publicSrcURL}${PublicConfig.webToolJsName.main}?q=${PublicConfig.webToolJsOnlyKey.main}"></script>
<script type="text/javascript" src="${ResURL.publicSrcURL}${PublicConfig.webToolJsName.alert}?q=${PublicConfig.webToolJsOnlyKey.alert}"></script>
</head>
          `,
        );
        //在所有脚本前加上webload脚本
        _html = _html.replace(
          /\<body\>/,
          `<body>
<script type="text/javascript" src="${ResURL.publicSrcURL}${PublicConfig.webToolJsName.load}?q=${PublicConfig.webToolJsOnlyKey.load}"></script>
                `,
        );
        //添加提示
        _html = `
<!-- 此内容被包装过，和源文件内容有差异。 -->
${_html}
                `;
        //
        r(_html);
      });
    });
  }
}
