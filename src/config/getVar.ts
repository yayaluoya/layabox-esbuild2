import https from 'https';
import { JSONPar } from '../../yayaluoya-tool/JSONPar';

type VarT = {
  /** 消息 */
  msgs?: {
    msg: string;
    color: '';
  }[];
};

let getVarP = new Promise<VarT>((res, rej) => {
  //调用统计api
  let rep = https.request(
    'https://variables2.oss-cn-beijing.aliyuncs.com/yayaluoya/layabox_esbuild2/%24V_YAYALUOYA_LAYABOX_ESBUILD2.json',
    {
      method: 'get',
      headers: {
        Referer: 'http://layabox-esbuild2.tool',
      },
    },
    (msg) => {
      let s = '';
      msg.setEncoding('utf8');
      msg.addListener('data', (d) => {
        s += d;
      });
      msg.addListener('end', () => {
        res(JSONPar(s, {}));
      });
    },
  );
  rep.end();
  rep.addListener('error', (err) => {
    rej(err);
  });
});

/**
 * 获取变量配置
 * @returns
 */
export function getVar() {
  return getVarP.catch(() => ({} as VarT));
}
