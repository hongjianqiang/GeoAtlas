"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var https_1 = __importDefault(require("https"));
// 同时下载的线程数
var THREADS = 10;
// 实时统计下载了多少个文件
var count = 0;
function flatDeep(arr, d) {
    if (d === void 0) { d = 1; }
    return d > 0 ? arr.reduce(function (acc, val) { return acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val); }, [])
        : arr.slice();
}
;
function httpsGet(url, encoding) {
    if (encoding === void 0) { encoding = 'utf8'; }
    return new Promise(function (resolve) {
        https_1.default.get(url, function (res) {
            var rawData = '';
            res.setEncoding(encoding);
            res.on('data', function (chunk) { return rawData += chunk; });
            res.on('end', function () {
                var obj;
                try {
                    obj = JSON.parse(rawData);
                    resolve(obj);
                }
                catch (err) {
                    console.error("JSON \u89E3\u6790\u51FA\u9519\uFF0C\u53EF\u80FD\u4E0D\u5B58\u5728\u6B64\u6587\u4EF6 " + url);
                    resolve(null);
                }
            });
        });
    });
}
function writeFile(filepath, data) {
    return new Promise(function (resolve, reject) {
        var str = '';
        try {
            str = JSON.stringify(data);
        }
        catch (err) {
            console.error(err);
        }
        fs_1.default.writeFile(filepath, str, function (err) {
            if (err) {
                console.error(filepath);
                console.error(err);
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
function download(adcode, isFull) {
    if (adcode === void 0) { adcode = '100000'; }
    if (isFull === void 0) { isFull = false; }
    return __awaiter(this, void 0, void 0, function () {
        var BASE, SAVE, file, link, filePath, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    BASE = 'https://geo.datav.aliyun.com/areas_v2/bound/';
                    SAVE = './china/';
                    file = adcode + ".json";
                    isFull && (file = adcode + "_full.json");
                    link = "" + BASE + file;
                    filePath = "" + SAVE + file;
                    return [4 /*yield*/, httpsGet(link)];
                case 1:
                    res = _a.sent();
                    if (!res) return [3 /*break*/, 3];
                    return [4 /*yield*/, writeFile(filePath, res)];
                case 2:
                    _a.sent();
                    console.log(++count + "\u3001" + filePath + " OK");
                    _a.label = 3;
                case 3:
                    if (isFull && res && Array.isArray(res.features)) {
                        return [2 /*return*/, res.features.map(function (m) { return m.properties.adcode; })];
                    }
                    else {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// 程序主入口
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var adcodes, adcodesMap, portion, results, newAdcodes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adcodes = ['100000'];
                    adcodesMap = Object.create(null);
                    _a.label = 1;
                case 1:
                    if (!adcodes.length) return [3 /*break*/, 4];
                    portion = adcodes.splice(0, THREADS);
                    return [4 /*yield*/, Promise.all(portion.map(function (adcode) { return download(adcode, false); }))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Promise.all(portion.map(function (adcode) { return download(adcode, true); }))];
                case 3:
                    results = _a.sent();
                    if (Array.isArray(results)) {
                        newAdcodes = flatDeep(results, Infinity).filter(function (adcode) { return adcode && !adcodesMap[adcode]; });
                        adcodes.push.apply(adcodes, newAdcodes);
                    }
                    portion.map(function (adcode) { return (adcodesMap[adcode] = true); });
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main();
