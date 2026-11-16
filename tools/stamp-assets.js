// Adds a content hash to the stylesheet and icon sprite URLs in the pages
// (css/index.css?v=…, img/icons.svg?v=…), so browsers never pair a new page
// with an old cached stylesheet after an update.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const assets = ['css/index.css', 'img/icons.svg'];
const pages = fs.readdirSync(root).filter(f => f.endsWith('.html'));

const hashes = Object.fromEntries(assets.map(asset => {
    const content = fs.readFileSync(path.join(root, asset));
    return [asset, crypto.createHash('sha256').update(content).digest('hex').slice(0, 10)];
}));

for (const page of pages) {
    const file = path.join(root, page);
    let html = fs.readFileSync(file, 'utf8');
    for (const [asset, hash] of Object.entries(hashes)) {
        const pattern = new RegExp(asset.replace(/[.]/g, '\\.') + '(\\?v=[0-9a-f]+)?', 'g');
        html = html.replace(pattern, `${asset}?v=${hash}`);
    }
    fs.writeFileSync(file, html);
}
// Service worker: name the cache after this build so a new build replaces the old cache
const swTemplate = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const build = crypto.createHash('sha256').update(Object.values(hashes).join('')).digest('hex').slice(0, 8);
const sw = swTemplate
    .replace(/mabdullah-v[0-9A-Za-z_]+/, `mabdullah-v${build}`)
    .replace(/css\/index\.css\?v=[0-9a-f_]+/, `css/index.css?v=${hashes['css/index.css']}`)
    .replace(/img\/icons\.svg\?v=[0-9a-f_]+/, `img/icons.svg?v=${hashes['img/icons.svg']}`);
fs.writeFileSync(path.join(root, 'sw.js'), sw);
console.log('Stamped', pages.join(', '), hashes, 'sw', build);
