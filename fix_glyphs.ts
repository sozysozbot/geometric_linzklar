import * as fs from 'fs';

(async function() {
const in_path = process.argv[2] ?? "char_glyphs_without_borders"
const fix_path = process.argv[3] ?? "fixed_glyphs"
const out_path = process.argv[4] ?? "fonts"
const SVGFixer = require("oslllo-svg-fixer");

const fix_options = {
  showProgressBar: true,
  throwIfDestinationDoesNotExist: false,
};

await SVGFixer(`./${in_path}`, `./${fix_path}`, fix_options).fix();

const files = fs.readdirSync(`${fix_path}/`);
files.forEach(function (file, _index) {
    if (file.slice(-4) !== ".svg") return;
    const svg_glyph = fs.readFileSync(`${fix_path}/${file}`, 'utf-8').replace(/viewBox="0 0 136 120"/, `viewBox="0 0 600 529.4117647058824"`);
    fs.writeFileSync(`${fix_path}/${file}`, svg_glyph);
})
})();
