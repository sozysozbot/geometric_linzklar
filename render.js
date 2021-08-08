const in_path = process.argv[2] ?? "char_glyphs"
const out_file_name = process.argv[3] ?? "main.svg"
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

const s = JSON.parse(fs.readFileSync(`renderer_settings.json`, 'utf-8'));

const glyphs_to_render = text.split("\n");
const num_of_glyphs_each_row_can_contain = [...s.column_format].filter(c => c == "*").length;
if (num_of_glyphs_each_row_can_contain === 0) {
    console.error(`column_format must contain at least one asterisk`)
}
const column_num = Math.ceil(glyphs_to_render.length / num_of_glyphs_each_row_can_contain);

// border_colors に載っている枠線色の個数は、column_format の文字数と一致している必要があり、
if (s.border_colors.length !== [...s.column_format].length) {
    console.warn(`LENGTH MISMATCH: In the setting, border_colors has length ${s.border_colors.length} but column_format has length ${[...s.column_format].length}`)
}
// 一致していることを確認してからそれを row_num と名付ける。
const row_num = s.border_colors.length;

const image_full_height = 10 + row_num * 120 + 10;

const single_column = `        <${"path"} fill="#a00" d="m-10 -10h156v${image_full_height}h-156z" />\n` +
    s.border_colors.map((color, ind) => `        <${"path"} fill="${color}" d="m0 ${120 * ind}h136v120h-136" />`).join("\n") + "\n\n" +
    Array.from({ length: row_num }, (_, ind) => `        <${"path"} fill="${s.cell_inner_color}" d="m10 ${10 + 120 * ind}h116v100h-116" />`).join("\n");

const columns = Array.from(
    { length: column_num },
    (_, index) => `    <g id="column${column_num - 1 - index}" stroke-width="0" transform="translate(${s.viewBox_min_x + 10 + (156 + s.column_spacing) * index}, ${s.viewBox_min_y + 10})">
${single_column}
    </g>`
).join("\n");

const image_full_width = column_num * (156 + s.column_spacing) - s.column_spacing;


fs.writeFileSync(out_file_name,
    `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${image_full_width}px" height="${image_full_height}px" version="1.1" viewBox="${s.viewBox_min_x} ${s.viewBox_min_y} ${image_full_width} ${image_full_height}" xmlns="http://www.w3.org/2000/svg">
${columns}

    <g id="glyphs" stroke="#000" stroke-width="10" fill="none">
${glyphs_to_render.filter(row => row.trim() !== "").map((row, ind) => {
        const [initial] = [...row];
        const rem = ind % num_of_glyphs_each_row_can_contain; // determines the y coordinate
        const quot = Math.floor(ind / num_of_glyphs_each_row_can_contain); // determines the x coordinate

        // column${column_num - 1 - index} corresponds to translate(${s.viewBox_min_x + 10 + (156 + s.column_spacing) * index}
        // column${quot} corresponds to translate(${s.viewBox_min_x + 10 + (156 + s.column_spacing) * (column_num - quot - 1), ...}
        const translate_x = s.viewBox_min_x + 10 + (156 + s.column_spacing) * (column_num - quot - 1);

        // a clever technique from https://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
        // in which the fact that `String.prototype.split` has a second argument `.split(separator, limit)` is vrey cleverly used.
        const vertical_pos = s.column_format.split("*", rem + 1).join("*").length;
        const translate_y = s.viewBox_min_y + 10 + 120 * vertical_pos;

        return `        <g id="${row}${(1000 + ind).toString(10).slice(1)}" transform="translate(${translate_x}, ${translate_y})">${glyph_map.get(initial)}</g>\n`
    }).join("\n")
    }    </g>
</svg>`);

