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
exports.__esModule = true;
var fs = require("fs");
(function () {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var in_path, fix_path, out_path, SVGFixer, fix_options, files;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    in_path = (_a = process.argv[2]) !== null && _a !== void 0 ? _a : "char_glyphs_without_borders";
                    fix_path = (_b = process.argv[3]) !== null && _b !== void 0 ? _b : "fixed_glyphs";
                    out_path = (_c = process.argv[4]) !== null && _c !== void 0 ? _c : "fonts";
                    SVGFixer = require("oslllo-svg-fixer");
                    fix_options = {
                        showProgressBar: true,
                        throwIfDestinationDoesNotExist: false
                    };
                    return [4 /*yield*/, SVGFixer("./" + in_path, "./" + fix_path, fix_options).fix()];
                case 1:
                    _d.sent();
                    files = fs.readdirSync(fix_path + "/");
                    files.forEach(function (file, _index) {
                        if (file.slice(-4) !== ".svg")
                            return;
                        var svg_glyph = fs.readFileSync(fix_path + "/" + file, 'utf-8').replace(/viewBox="0 0 136 120"/, "viewBox=\"0 0 600 529.4117647058824\"");
                        fs.writeFileSync(fix_path + "/" + file, svg_glyph);
                    });
                    return [2 /*return*/];
            }
        });
    });
})();
