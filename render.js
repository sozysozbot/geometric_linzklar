const in_path = process.argv[2] ?? "char_glyphs"
const out_file_name = process.argv[3] ?? "main (2).svg"
const fs = require('fs');
const text = fs.readFileSync(`${in_path}/content.txt`, 'utf-8');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const glyph_map = new Map();
fs.readdir(`${in_path}/`, function (err, files) {
    if (err) { return console.error(err); }
    files.forEach(function (file, _index) {
        if (file.slice(-4) !== ".svg") return;
        const svg_glyph = fs.readFileSync(`${in_path}/${file}`, 'utf-8');
        const dom = new JSDOM(svg_glyph);
        const glyph = dom.window.document.getElementById("glyph").innerHTML;
        glyph_map.set(file.slice(0, -4), glyph);
        console.log(file.slice(0, -4), glyph)
    })
});

const s = JSON.parse(fs.readFileSync(`renderer_settings.json`, 'utf-8'));

const column = `        <path fill="#a00" d="m-10-130h156v1940h-156z" />\n` +
    s.border_colors.map((color, ind) => `        <${"path"} fill="${color}" d="m0 ${s.viewBox_min_y + 10 + 120 * ind}h136v120h-136" />`).join("\n") + "\n\n" +
    [...s.column_format].map((_v, ind) => `        <${"path"} fill="${s.cell_color}" d="m10 ${s.viewBox_min_y + 20 + 120 * ind}h116v100h-116" />`).join("\n");

const column_num = 17; // fixme

const columns = Array.from(
    { length: column_num },
    (_, index) => `    <g id="column${column_num - 1 - index}" stroke-width="0" transform="translate(${s.viewBox_min_x + 10 + (156 + s.column_spacing) * index}, 0)">
${column}
    </g>`
).join("\n");

const width = column_num * (156 + s.column_spacing) - s.column_spacing;

fs.writeFileSync(out_file_name,
    `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}px" height="1940px" version="1.1" viewBox="${s.viewBox_min_x} ${s.viewBox_min_y} ${width} 1940" xmlns="http://www.w3.org/2000/svg">
${columns}
</svg>`);

