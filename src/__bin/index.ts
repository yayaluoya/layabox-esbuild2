#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import bugLog from './bugLog';
import layaboxEsbuild from '../Main';
import IConfig, { getDefConfig } from '../config/IConfig';
import PackageConfig from '../config/PackageConfig';
import { getAbsolute } from '../_T/getAbsolute';
import MainConfig from '../config/MainConfig';

/** 模板配置文件地址 */
const temConfigFIlePath = path.join(__dirname, '../../config_tem.js');
/** 配置文件名字 */
const configName = `leb2_config@${PackageConfig.package.version.replace(/\./g, '-')}.js`;

const program = new Command();

//定义其它选项
program
  .option('-v --version')
  .option('-h --help')
  .option('-i --init')
  .option('-s --start')
  .option('-c --config <url>')
  .option('-lc --log-config [url]')
  .option('-b --bug');

program.parse(process.argv);
//解析命令行参数
const options = program.opts();
// console.log(options);

(async () => {
  /** 默认配置 */
  let defaultConfig = getDefConfig();
  /** 配置文件 */
  let config = await getConfig(configName).catch(() => ({}));
  /** 临时配置文件 */
  let _config: Partial<IConfig>;
  switch (true) {
    case Boolean(options.version):
      console.log(
        chalk.green('当前layabox-esbuild2的版本号@ ') +
          chalk.yellow(PackageConfig.package.version),
      );
      break;
    //帮助
    case Boolean(options.help):
      console.log('\n');
      console.log(chalk.green('layabox-esbuild2工具的全部命令选项:'));
      console.log(chalk.gray('->'));
      console.log(chalk.magenta('快捷命令 leb2'));
      console.log(
        chalk.blue('-v --version'),
        chalk.gray('查看当前layabox-esbuild2工具版本号'),
      );
      console.log(chalk.blue('-h --help'), chalk.gray('查看帮助信息'));
      console.log(chalk.blue('-i --init'), chalk.gray('在当前执行目录初始化配置文件'));
      console.log(chalk.blue('-s --start'), chalk.gray('开始构建项目'));
      console.log(
        chalk.blue('-c --config <url>'),
        chalk.gray(
          '指定配置文件来构建项目，参数为配置文件url，可以是绝对路径或者相对路径',
        ),
      );
      console.log(
        chalk.blue('-lc --log-config [url]'),
        chalk.gray('查看配置，不填的话则打印默认配置信息'),
      );
      console.log(chalk.blue('-b --bug'), chalk.gray('查看可能的bug和对应的解决方案。'));
      console.log(chalk.gray('-'));
      console.log(chalk.gray('注意：参数是不用带\'或者"符号的。'));
      break;
    //初始化
    case Boolean(options.init):
      let _configUrl = path.join(process.cwd(), configName);
      //先查看是否有该文件
      fs.stat(_configUrl, (err, stats) => {
        if (!err && stats.isFile()) {
          console.log(chalk.red('配置文件已经存在，请在该文件上添加配置。', _configUrl));
          return;
        }
        //
        let stream = fs
          .createReadStream(temConfigFIlePath)
          .pipe(fs.createWriteStream(_configUrl));
        stream.on('close', () => {
          console.log(chalk.green('配置文件初始化完成。', _configUrl));
        });
      });
      //
      break;
    //查看配置
    case Boolean(options.logConfig):
      //
      console.log(chalk.yellow('配置数据:\n'));
      //
      if (typeof options.logConfig == 'string') {
        _config = await getConfig(options.logConfig).catch((url) => {
          console.log(chalk.red(`获取配置文件失败@${url}`));
          return {};
        });
      } else {
        //默认在项目执行目录下找配置文件
        _config = config;
      }
      _config = MainConfig.merge(defaultConfig, _config);
      //
      console.log(_config);
      break;
    //指定配置构建
    case Boolean(options.config):
      _config = await getConfig(options.config).catch((url) => {
        console.log(chalk.red(`获取配置文件失败@${url}`));
        return {} as IConfig;
      });
      build(MainConfig.merge(defaultConfig, _config));
      break;
    //开始构建
    case Boolean(options.start):
      build(MainConfig.merge(defaultConfig, config));
      break;
    //查看bug和解决方案
    case Boolean(options.bug):
      let i = 1;
      for (let { describe, resolve } of bugLog) {
        console.log(i++, chalk.red(describe));
        console.log(chalk.blue(resolve));
      }
      break;
    //直接执行，没有任何参数
    default:
      build(MainConfig.merge(defaultConfig, config));
      break;
  }
})();

/**
 * 开始构建
 * @param config 配置信息
 */
function build(config: IConfig) {
  // console.log('开始构建', config);
  //开始
  layaboxEsbuild.start(config);
}

/**
 * 通过一个地址获取配置信息
 * @param path 文件地址，可以是相对地址也可以是绝对地址
 */
function getConfig(path: string): Promise<IConfig> {
  return new Promise((r, e) => {
    if (path) {
      path = getAbsolute(path);
      try {
        r(require(path));
      } catch (err) {
        e(path);
      }
    }
  });
}
