import http from 'http';
import internalIp from 'internal-ip';
import MainConfig from '../config/MainConfig';
import PortTool from './PortTool';
import chalk from 'chalk';

/**
 * http工具
 */
export default class HttpTool {
  /**
   * 创建一个http服务
   * @param _f 请求响应执行方法
   * @param _port 端口
   */
  static createServer(_f: http.RequestListener, _port: number): Promise<http.Server> {
    let _portP: Promise<number>;
    //端口为0则自动分配端口
    if (_port == 0) {
      _portP = PortTool.getPool('http服务');
    } else {
      _portP = Promise.resolve(_port);
    }
    //
    return _portP.then((port) => {
      //开启一个本地服务
      let server = http.createServer(_f).listen(port);
      //
      return server;
    });
  }

  /** 主机名字 */
  private static m_hostName: string;
  /**
   * 获取主机地址
   */
  static get getHostname(): string {
    if (!this.m_hostName) {
      this.m_hostName = internalIp.v4.sync();
      if (!this.m_hostName) {
        this.m_hostName = MainConfig.config.hostName!;
        if (!this.m_hostName) {
          console.log(
            chalk.red(`自动获取主机地址失败！请在配置文件中配置正确的主机地址。`),
          );
        }
      }
      MainConfig.config.ifLog && console.log(`当前获取的主机地址为:${this.m_hostName}`);
    }
    //
    //
    return this.m_hostName;
  }

  /**
   * 根据端口获取路径
   * @param type
   * @param port
   * @returns
   */
  static getPath(type: 'local' | 'localNetwork', port: number) {
    switch (type) {
      case 'local':
        return `http://localhost:${port}`;
      case 'localNetwork':
        return `http://${HttpTool.getHostname}:${port}`;
    }
  }
}
