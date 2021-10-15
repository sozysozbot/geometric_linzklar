(() => {
    const file_name = process.argv[2] ?? "main.svg";
    const out_path = process.argv[3] ?? "char_glyphs_without_borders";
    const fs = require('fs');
    const text = fs.readFileSync(file_name, 'utf-8');
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const dom = new JSDOM(text);
    const glyphs = [...dom.window.document.getElementById("glyphs").childNodes];
    const glyph_map = new Map();
    let previous_num = -1;
    let text_content = "";
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
        const keys = char.split('/');
        for (let key of keys) {
            if (glyph_map.has(key)) {
                console.warn(`DUPLICATE KEY: ${key}`);
            }
            // kick in the conversion to the relative coordinate here
            glyph_map.set(key, glyph.innerHTML.replace(/d="M/g, 'd="m'));
        }
        text_content += char + "\n";
    }
    fs.writeFileSync(`${out_path}/content.txt`, text_content);
    glyph_map.forEach((value, key) => {
        fs.writeFileSync(`${out_path}/${key}.svg`, `<?xml version="1.0" encoding="UTF-8"?>
<svg width="136mm" height="120mm" version="1.1" viewBox="0 0 136 120" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#000" stroke-width="10" fill="none">
        <g id="glyph">${value}</g>
    </g>
</svg>`);
    });
    console.log(`Wrote ${glyph_map.size} glyphs and \`content.txt\` under \`${out_path}/\`. Note that the number of the glyphs can be greater than the number of rows in \`content.txt\` because of cases like 石/岩 where the glyphs are shared.`);
})();
