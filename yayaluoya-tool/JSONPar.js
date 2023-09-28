"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONPar = void 0;
/**
 * json解析
 * 如果解析出错了会返回默认值
 * @param str
 * @param def
 * @param reviver
 */
function JSONPar(str, def, reviver) {
    try {
        return JSON.parse(str, reviver);
    }
    catch (_a) {
        return def;
    }
}
exports.JSONPar = JSONPar;
