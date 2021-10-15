(async function () {
    const in_path = process.argv[2] ?? "char_glyphs_without_borders";
    const fix_path = process.argv[3] ?? "fixed_glyphs";
    const out_path = process.argv[4] ?? "fonts";
    const SVGFixer = require("oslllo-svg-fixer");
    const fix_options = {
        showProgressBar: true,
        throwIfDestinationDoesNotExist: false,
    };
    await SVGFixer(`./${in_path}`, `./${fix_path}`, fix_options).fix();
})();
