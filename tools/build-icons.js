// Builds img/icons.svg from the Font Awesome icons the pages reference as
// href="img/icons.svg#<set>-<name>" (set = solid | regular | brands).
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter(f => f.endsWith('.html'));
const svgDir = path.join(root, 'node_modules/@fortawesome/fontawesome-free/svgs');

const ids = new Set();
for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    for (const m of html.matchAll(/icons\.svg#((?:solid|regular|brands)-[a-z0-9-]+)/g)) ids.add(m[1]);
}

const symbols = [...ids].sort().map(id => {
    const [, set, name] = id.match(/^(solid|regular|brands)-(.+)$/);
    const file = path.join(svgDir, set, `${name}.svg`);
    if (!fs.existsSync(file)) throw new Error(`Unknown icon: ${id}`);
    const svg = fs.readFileSync(file, 'utf8');
    const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
    const body = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<!--[\s\S]*?-->/g, '');
    return `<symbol id="${id}" viewBox="${viewBox}">${body}</symbol>`;
});

fs.writeFileSync(path.join(root, 'img/icons.svg'),
    '<svg xmlns="http://www.w3.org/2000/svg">\n' +
    '<!-- Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0) -->\n' +
    symbols.join('\n') + '\n</svg>\n');
console.log(`img/icons.svg: ${symbols.length} icons`);
