import * as fs from 'fs';
(() => {
const in_path = process.argv[2] ?? "char_glyphs"
const out_file_name = process.argv[3] ?? "main.svg"
const text: string = fs.readFileSync(`${in_path}/content.txt`, 'utf-8');
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

const config = JSON.parse(fs.readFileSync(`renderer_settings.json`, 'utf-8'));
const full_cell_height = 120;
const full_cell_width = 136;

const glyphs_to_render = text.split("\n").map(row => row.trim()).filter(row => row !== "");
const num_of_glyphs_each_row_can_contain = [...config.column_format].filter(c => c == "*").length;
if (num_of_glyphs_each_row_can_contain === 0) {
    console.error(`column_format must contain at least one asterisk`)
}
const column_num = Math.ceil(glyphs_to_render.length / num_of_glyphs_each_row_can_contain);

// border_colors に載っている枠線色の個数は、column_format の文字数と一致している必要があり、
if (config.border_colors.length !== [...config.column_format].length) {
    console.warn(`LENGTH MISMATCH: In the setting, border_colors has length ${config.border_colors.length} but column_format has length ${[...config.column_format].length}`)
}
// 一致していることを確認してからそれを row_num と名付ける。
const row_num = config.border_colors.length;

const image_full_height = 10 + row_num * full_cell_height + 10;

const rectangle = (o: { color: string, min_x: number, min_y: number, width: number, height:number }) =>
    `        <${"path"} fill="${o.color}" d="m${o.min_x} ${o.min_y}h${o.width}v${o.height}h${-o.width}" />`;

const single_column_svg = `${rectangle({
    color: "#a00", min_x: -10, min_y: -10, width: full_cell_width + 10 + 10, height: image_full_height
})}\n` +
    config.border_colors.map((color: string, ind:number) => `${rectangle({
        color,
        min_x: 0,
        min_y: full_cell_height * ind,
        width: full_cell_width,
        height: full_cell_height
    })}`).join("\n") + "\n\n" +
    Array.from({ length: row_num }, (_, ind) => `${rectangle({
        color: config.cell_inner_color,
        min_x: 10,
        min_y: 10 + full_cell_height * ind,
        width: full_cell_width - 20,
        height: full_cell_height - 20
    })}`).join("\n");

const image_full_width = column_num * (full_cell_width + 20 + config.column_spacing) - config.column_spacing;

const viewBox_min_x = config.viewBox_max_x - image_full_width;

const columns_svg = Array.from(
    { length: column_num },
    (_, index) => `    <g id="column${column_num - 1 - index}" stroke-width="0" transform="translate(${viewBox_min_x + 10 + (full_cell_width + 20 + config.column_spacing) * index}, ${config.viewBox_min_y + 10})">
${single_column_svg}
    </g>`
).join("\n");



const glyphs_svg = glyphs_to_render.map((row, ind) => {
    const [initial] = [...row];
    const rem = ind % num_of_glyphs_each_row_can_contain; // determines the y coordinate
    const quot = Math.floor(ind / num_of_glyphs_each_row_can_contain); // determines the x coordinate

    // column${column_num - 1 - index} corresponds to translate(${viewBox_min_x + 10 + (full_cell_width + 20 + s.column_spacing) * index}
    // column${quot} corresponds to translate(${viewBox_min_x + 10 + (full_cell_width + 20 + s.column_spacing) * (column_num - quot - 1), ...}
    const translate_x = viewBox_min_x + 10 + (full_cell_width + 20 + config.column_spacing) * (column_num - quot - 1);

    // a clever technique from https://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
    // in which the fact that `String.prototype.split` has a second argument `.split(separator, limit)` is vrey cleverly used.
    const vertical_pos = config.column_format.split("*", rem + 1).join("*").length;
    const translate_y = config.viewBox_min_y + 10 + full_cell_height * vertical_pos;

    return `        <g id="${row}${(1000 + ind).toString(10).slice(1)}" transform="translate(${translate_x}, ${translate_y})">${glyph_map.get(initial) ?? "\n\t\t\tN/A\n\t\t"}</g>\n`
}).join("\n");



fs.writeFileSync(out_file_name,
    `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${image_full_width}px" height="${image_full_height}px" version="1.1" viewBox="${viewBox_min_x} ${config.viewBox_min_y} ${image_full_width} ${image_full_height}" xmlns="http://www.w3.org/2000/svg">
${columns_svg}

    <g id="glyphs" stroke="#000" stroke-width="10" fill="none">
${glyphs_svg}    </g>
</svg>`);
})();
