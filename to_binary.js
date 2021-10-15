"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse_svg = __importStar(require("svg-path-parser"));
(() => {
    const file_name = process.argv[2] ?? "main.svg";
    const out_path = process.argv[3] ?? "bin_glyphs";
    const { Buffer } = require('buffer');
    const fs = require('fs');
    const text = fs.readFileSync(file_name, 'utf-8');
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const dom = new JSDOM(text);
    const glyphs = [...dom.window.document.getElementById("glyphs").childNodes];
    let previous_num = -1;
    let text_content = "";
    let ans = [];
    for (let glyph of glyphs) {
        if (!glyph.id) {
            continue;
        }
        const id = `${glyph.id}`;
        const num_ = id.slice(-3);
        const num = Number.parseInt(num_, 10);
        const char = id.slice(0, -3); // can be a single character, like '軟', or a multiple characters, like '石/岩'
        console.log(char, num);
        if (num !== previous_num + 1) {
            console.warn(`INCORRECT NUMBERING: ${previous_num} is followed by ${num}`);
        }
        previous_num = num;
        const binary = [...glyph.childNodes].flatMap(path => {
            if (!path.getAttribute) {
                return [];
            }
            return parse_svg.parseSVG(path.getAttribute("d")).flatMap(c => {
                const scale_factor_min = 3;
                const scale_factor_max = 106;
                const check = (a) => {
                    if (scale_factor_min <= a && a <= scale_factor_max) {
                        return a;
                    }
                    else {
                        throw new Error(`scale factor out of range: (Found ${a}, expected [${scale_factor_min} <= a <= ${scale_factor_max}])`);
                    }
                };
                if (c.code === 'M') {
                    console.assert(10 <= c.x && c.x <= 126);
                    console.assert(10 <= c.y && c.y <= 110);
                    return [c.x, c.y];
                }
                else if (c.code === 'h') {
                    if (c.x > 0) {
                        return [4 * 32 + 0x06, check(c.x)];
                    }
                    else {
                        return [4 * 32 + 0x12, check(-c.x)];
                    }
                }
                else if (c.code === 'v') {
                    if (c.y > 0) {
                        return [4 * 32 + 0x0c, check(c.y)];
                    }
                    else {
                        return [4 * 32 + 0x00, check(-c.y)];
                    }
                }
                else if (c.code === 'l') {
                    if (c.y < 0 && c.x === 0) {
                        return [4 * 32 + 0x00, check(-c.y)];
                    }
                    else if (c.y < 0 && c.x * -3 === c.y) {
                        return [4 * 32 + 0x01, check(c.x)];
                    }
                    else if (c.y < 0 && c.x * -2 === c.y) {
                        return [4 * 32 + 0x02, check(c.x)];
                    }
                    else if (c.y < 0 && c.x * -1 === c.y) {
                        return [4 * 32 + 0x03, check(c.x)];
                    }
                    else if (c.y < 0 && c.x === c.y * -2) {
                        return [4 * 32 + 0x04, check(-c.y)];
                    }
                    else if (c.y < 0 && c.x === c.y * -3) {
                        return [4 * 32 + 0x05, check(-c.y)];
                    }
                    else if (c.y === 0 && c.x > 0) {
                        return [4 * 32 + 0x06, check(c.x)];
                    }
                    else if (c.y > 0 && c.x === c.y * 3) {
                        return [4 * 32 + 0x07, check(c.y)];
                    }
                    else if (c.y > 0 && c.x === c.y * 2) {
                        return [4 * 32 + 0x08, check(c.y)];
                    }
                    else if (c.y > 0 && c.x === c.y) {
                        return [4 * 32 + 0x09, check(c.y)];
                    }
                    else if (c.y > 0 && c.x * 2 === c.y) {
                        return [4 * 32 + 0x0a, check(c.x)];
                    }
                    else if (c.y > 0 && c.x * 3 === c.y) {
                        return [4 * 32 + 0x0b, check(c.x)];
                    }
                    else if (c.y > 0 && c.x === 0) {
                        return [4 * 32 + 0x0c, check(c.y)];
                    }
                    else if (c.y > 0 && c.x * -3 === c.y) {
                        return [4 * 32 + 0x0d, check(-c.x)];
                    }
                    else if (c.y > 0 && c.x * -2 === c.y) {
                        return [4 * 32 + 0x0e, check(-c.x)];
                    }
                    else if (c.y > 0 && c.x * -1 === c.y) {
                        return [4 * 32 + 0x0f, check(-c.x)];
                    }
                    else if (c.y > 0 && c.x === c.y * -2) {
                        return [4 * 32 + 0x10, check(c.y)];
                    }
                    else if (c.y > 0 && c.x === c.y * -3) {
                        return [4 * 32 + 0x11, check(c.y)];
                    }
                    else if (c.y === 0 && c.x < 0) {
                        return [4 * 32 + 0x12, check(-c.x)];
                    }
                    else if (c.y < 0 && c.x === c.y * 3) {
                        return [4 * 32 + 0x13, check(-c.y)];
                    }
                    else if (c.y < 0 && c.x === c.y * 2) {
                        return [4 * 32 + 0x14, check(-c.y)];
                    }
                    else if (c.y < 0 && c.x === c.y) {
                        return [4 * 32 + 0x15, check(-c.y)];
                    }
                    else if (c.y < 0 && c.x * 2 === c.y) {
                        return [4 * 32 + 0x16, check(-c.x)];
                    }
                    else if (c.y < 0 && c.x * 3 === c.y) {
                        return [4 * 32 + 0x17, check(-c.x)];
                    }
                    else {
                        throw new Error(`Unsupported ratio (x: ${c.x}, y: ${c.y})`);
                    }
                }
                else if (c.code === 'a') {
                    if (c.xAxisRotation !== 0) {
                        throw new Error(`Unsupported xAxisRotation ${c.xAxisRotation}`);
                    }
                    // sweep flag false: counterclockwise
                    // sweep flag true: clockwise
                    const sweep = c.sweep ? 5 : 6;
                    if (c.rx === c.ry) {
                        // circular
                        if (c.y < 0 && c.x === 0) {
                            return [sweep * 32 + 0x00, check(-c.y)];
                        }
                        else if (c.y < 0 && c.x * -1 === c.y) {
                            if (c.largeArc) {
                                throw new Error("three-quarters are not allowed");
                            }
                            return [sweep * 32 + 0x03, check(c.x)];
                        }
                        else if (c.y === 0 && c.x > 0) {
                            return [sweep * 32 + 0x06, check(c.x)];
                        }
                        else if (c.y > 0 && c.x === c.y) {
                            if (c.largeArc) {
                                throw new Error("three-quarters are not allowed");
                            }
                            return [sweep * 32 + 0x09, check(c.y)];
                        }
                        else if (c.y > 0 && c.x === 0) {
                            return [sweep * 32 + 0x0c, check(c.y)];
                        }
                        else if (c.y > 0 && c.x * -1 === c.y) {
                            if (c.largeArc) {
                                throw new Error("three-quarters are not allowed");
                            }
                            return [sweep * 32 + 0x0f, check(-c.x)];
                        }
                        else if (c.y === 0 && c.x < 0) {
                            return [sweep * 32 + 0x12, check(-c.x)];
                        }
                        else if (c.y < 0 && c.x === c.y) {
                            if (c.largeArc) {
                                throw new Error("three-quarters are not allowed");
                            }
                            return [sweep * 32 + 0x15, check(-c.y)];
                        }
                        else {
                            throw new Error(`Unsupported ratio in a circular arc (x: ${c.x}, y: ${c.y})`);
                        }
                    }
                    else if (c.rx * 2 === c.ry || c.rx === c.ry * 2) {
                        const is_vertically_long = c.rx * 2 === c.ry;
                        if (c.y < 0 && c.x === 0) {
                            return [sweep * 32 + (is_vertically_long ? 0x18 : 0x1c), check(-c.y)];
                        }
                        else if (c.y < 0 && c.x * -2 === c.y) {
                            if (c.largeArc) {
                                throw new Error("three-quarters are not allowed");
                            }
                            return [sweep * 32 + 0x02, check(c.x)];
                        }
                        else if (c.y < 0 && c.x === c.y * -2) {
                            if (c.largeArc) {
                                throw new Error("three-quarters are not allowed");
                            }
                            return [sweep * 32 + 0x04, check(-c.y)];
                        }
                        else if (c.y === 0 && c.x > 0) {
                            return [sweep * 32 + (is_vertically_long ? 0x19 : 0x1d), check(c.x)];
                        }
                        else if (c.y > 0 && c.x === c.y * 2) {
                            if (c.largeArc) {
                                throw new Error("three-quarters are not allowed");
                            }
                            return [sweep * 32 + 0x08, check(c.y)];
                        }
                        else if (c.y > 0 && c.x * 2 === c.y) {
                            if (c.largeArc) {
                                throw new Error("three-quarters are not allowed");
                            }
                            return [sweep * 32 + 0x0a, check(c.x)];
                        }
                        else if (c.y > 0 && c.x === 0) {
                            return [sweep * 32 + (is_vertically_long ? 0x1a : 0x1e), check(c.y)];
                        }
                        else if (c.y > 0 && c.x * -2 === c.y) {
                            if (c.largeArc) {
                                throw new Error("three-quarters are not allowed");
                            }
                            return [sweep * 32 + 0x0e, check(-c.x)];
                        }
                        else if (c.y > 0 && c.x === c.y * -2) {
                            if (c.largeArc) {
                                throw new Error("three-quarters are not allowed");
                            }
                            return [sweep * 32 + 0x10, check(c.y)];
                        }
                        else if (c.y === 0 && c.x < 0) {
                            return [sweep * 32 + (is_vertically_long ? 0x1b : 0x1f), check(-c.x)];
                        }
                        else if (c.y < 0 && c.x === c.y * 2) {
                            if (c.largeArc) {
                                throw new Error("three-quarters are not allowed");
                            }
                            return [sweep * 32 + 0x14, check(-c.y)];
                        }
                        else if (c.y < 0 && c.x * 2 === c.y) {
                            if (c.largeArc) {
                                throw new Error("three-quarters are not allowed");
                            }
                            return [sweep * 32 + 0x16, check(-c.x)];
                        }
                        else {
                            throw new Error(`Unsupported ratio in an elliptical arc (x: ${c.x}, y: ${c.y})`);
                        }
                    }
                    else {
                        throw new Error(`Unsupported ratio of ellipse (rx: ${c.rx}, ry: ${c.ry})`);
                    }
                }
                else {
                    throw new Error(`Unsupported command (code: ${c.code}, command: ${c.command})`);
                }
            });
        });
        console.log(binary);
        ans = [...ans, ...binary, 255, 255];
        text_content += char + "\n";
    }
    fs.writeFileSync(`${out_path}/content.txt`, text_content);
    const buf = Buffer.from(ans);
    fs.writeFileSync(`${out_path}/glyphs`, buf);
})();
