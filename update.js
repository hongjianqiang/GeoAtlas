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
// 配置信息
function Config(adcode) {
    if (adcode === void 0) { adcode = '100000'; }
    var BASE = 'https://geo.datav.aliyun.com/areas_v2/bound/';
    var OUT_DIR = './china';
    var file1 = adcode + ".json";
    var file2 = adcode + "_full.json";
    return {
        outFiles: [
            OUT_DIR + "/" + file1,
            OUT_DIR + "/" + file2
        ],
        urls: [
            "" + BASE + file1,
            "" + BASE + file2,
        ]
    };
}
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
function recursive(config) {
    return __awaiter(this, void 0, void 0, function () {
        var urls, outFiles, url, file, res, adcodes, _i, adcodes_1, adcode, config_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    urls = config.urls, outFiles = config.outFiles;
                    url = '', file = '';
                    // 不包含子区域
                    url = urls[0];
                    file = outFiles[0];
                    return [4 /*yield*/, httpsGet(url)];
                case 1:
                    res = _a.sent();
                    if (!res) return [3 /*break*/, 3];
                    return [4 /*yield*/, writeFile(file, res)];
                case 2:
                    _a.sent();
                    console.log(url);
                    _a.label = 3;
                case 3:
                    // 包含子区域
                    url = urls[1];
                    file = outFiles[1];
                    return [4 /*yield*/, httpsGet(url)];
                case 4:
                    res = _a.sent();
                    if (!res) return [3 /*break*/, 9];
                    return [4 /*yield*/, writeFile(file, res)];
                case 5:
                    _a.sent();
                    console.log(url);
                    adcodes = res.features.map(function (m) { return m.properties.adcode; });
                    _i = 0, adcodes_1 = adcodes;
                    _a.label = 6;
                case 6:
                    if (!(_i < adcodes_1.length)) return [3 /*break*/, 9];
                    adcode = adcodes_1[_i];
                    config_1 = Config(adcode);
                    return [4 /*yield*/, recursive(config_1)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// 程序主入口
function main() {
    recursive(Config());
}
main();
