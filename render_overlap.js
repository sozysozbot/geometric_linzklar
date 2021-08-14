const in_path = process.argv[2] ?? "char_glyphs"
const out_file_name = process.argv[3] ?? "overlap.svg"
const fs = require('fs');
const text = fs.readFileSync(`${in_path}/content.txt`, 'utf-8');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const glyph_map = new Map();
const files = fs.readdirSync(`${in_path}/`);
files.forEach(function (file, _index) {
    if (file.slice(-4) !== ".svg") return;
    const svg_glyph = fs.readFileSync(`${in_path}/${file}`, 'utf-8');
    const dom = new JSDOM(svg_glyph);
    const glyph_ = dom.window.document.getElementById("glyph").innerHTML;

    /* DIRTY HACK */
    const glyph = glyph_.replace(/><\/path>/g, " />")
    glyph_map.set(file.slice(0, -4), glyph);
})

const full_cell_height = 120;
const full_cell_width = 136;

const glyphs_to_render = text.split("\n").map(row => row.trim()).filter(row => row !== "");

const rectangle = ({ color, min_x, min_y, width, height }) =>
    `        <${"path"} fill="${color}" d="m${min_x} ${min_y}h${width}v${height}h${-width}" />`;

const glyphs_svg = glyphs_to_render.map((row, ind) => {
    const [initial] = [...row];
    return `        <g id="${row}${(1000 + ind).toString(10).slice(1)}" >${glyph_map.get(initial) ?? "\n\t\t\tN/A\n\t\t"}</g>\n`
}).join("\n");

fs.writeFileSync(out_file_name,
    `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${(full_cell_width + 20) * 10}px" height="${(full_cell_height + 20) * 10}px" version="1.1" viewBox="-10 -10 ${full_cell_width + 20} ${full_cell_height + 20}" xmlns="http://www.w3.org/2000/svg">

    <g id="column0" stroke-width="0">
${rectangle({ color: "#a00", min_x: -10, min_y: -10, width: 156, height: 140 })}
${rectangle({ color: "#ffa", min_x: 0, min_y: 0, width: 136, height: 120 })}
${rectangle({ color: "#fff", min_x: 10, min_y: 10, width: 116, height: 100 })}
    </g>

    <g id="glyphs" stroke="#000" stroke-width="10" fill="none" stroke-opacity="0.005">
${glyphs_svg}    </g>
</svg>`);

