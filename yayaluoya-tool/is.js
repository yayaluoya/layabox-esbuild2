"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUrl = exports.isClient = exports.isServer = exports.isMap = exports.isElement = exports.isWindow = exports.isArray = exports.isRegExp = exports.isBoolean = exports.isFunction = exports.isString = exports.isPromise = exports.isNumber = exports.isNullOrUnDef = exports.isNullAndUnDef = exports.isNull = exports.isDate = exports.isEmpty = exports.isObject = exports.isUnDef = exports.isDef = exports.is = void 0;
var toString = Object.prototype.toString;
function is(val, type) {
    return toString.call(val) === "[object ".concat(type, "]");
}
exports.is = is;
function isDef(val) {
    return typeof val !== 'undefined';
}
exports.isDef = isDef;
function isUnDef(val) {
    return !isDef(val);
}
exports.isUnDef = isUnDef;
function isObject(val) {
    return val !== null && is(val, 'Object');
}
exports.isObject = isObject;
function isEmpty(val) {
    if (isArray(val) || isString(val)) {
        return val.length === 0;
    }
    if (val instanceof Map || val instanceof Set) {
        return val.size === 0;
    }
    if (isObject(val)) {
        return Object.keys(val).length === 0;
    }
    return false;
}
exports.isEmpty = isEmpty;
function isDate(val) {
    return is(val, 'Date');
}
exports.isDate = isDate;
function isNull(val) {
    return val === null;
}
exports.isNull = isNull;
function isNullAndUnDef(val) {
    return isUnDef(val) && isNull(val);
}
exports.isNullAndUnDef = isNullAndUnDef;
function isNullOrUnDef(val) {
    return isUnDef(val) || isNull(val);
}
exports.isNullOrUnDef = isNullOrUnDef;
function isNumber(val) {
    return is(val, 'Number');
}
exports.isNumber = isNumber;
function isPromise(val) {
    return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch);
}
exports.isPromise = isPromise;
function isString(val) {
    return is(val, 'String');
}
exports.isString = isString;
function isFunction(val) {
    return typeof val === 'function';
}
exports.isFunction = isFunction;
function isBoolean(val) {
    return is(val, 'Boolean');
}
exports.isBoolean = isBoolean;
function isRegExp(val) {
    return is(val, 'RegExp');
}
exports.isRegExp = isRegExp;
function isArray(val) {
    return val && Array.isArray(val);
}
exports.isArray = isArray;
function isWindow(val) {
    return typeof window !== 'undefined' && is(val, 'Window');
}
exports.isWindow = isWindow;
function isElement(val) {
    return isObject(val) && !!val.tagName;
}
exports.isElement = isElement;
function isMap(val) {
    return is(val, 'Map');
}
exports.isMap = isMap;
exports.isServer = typeof window === 'undefined';
exports.isClient = !exports.isServer;
var isUrlReg = /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
function isUrl(path) {
    return isUrlReg.test(path);
}
exports.isUrl = isUrl;
