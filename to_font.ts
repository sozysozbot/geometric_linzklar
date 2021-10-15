import { generateFonts, FontAssetType } from 'fantasticon';
import * as fs from 'fs';
(async function() {
const in_path = process.argv[2] ?? "char_glyphs"
const fix_path = process.argv[3] ?? "fixed_glyphs"
const out_path = process.argv[4] ?? "fonts"
const SVGFixer = require("oslllo-svg-fixer");

const fix_options = {
  showProgressBar: true,
  throwIfDestinationDoesNotExist: false,
};

await SVGFixer(`./${in_path}`, `./${fix_path}`, fix_options).fix();

const glyph_map: { [key: string]: number } = {};
const files = fs.readdirSync(`${fix_path}/`);
files.forEach((file, index) => {
  if (file.slice(-4) !== ".svg") return;
  glyph_map[file[0]] = file.charCodeAt(0);

  const svg_path = `${fix_path}/${file}`;
  const svg_glyph = fs.readFileSync(svg_path, 'utf-8').replace("0 0 136 120", `0 0 600 ${600/136*120}`);
  fs.writeFileSync(svg_path, svg_glyph, 'utf-8');
});

generateFonts({
  inputDir: `./${fix_path}`,
  outputDir: `./${out_path}`,
  name: "geometric_linzklar",
  fontTypes: [FontAssetType.TTF, FontAssetType.WOFF],
  fontHeight: 480,
  codepoints: glyph_map
}).then(results => console.log(results));
})();
