const fs = require('fs');
const path = require('path');

const root = process.cwd();
const out = path.join(root, 'www');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const allowed = new Set(['.html', '.js', '.css', '.json', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico']);
for (const name of fs.readdirSync(root)) {
  const src = path.join(root, name);
  if (!fs.statSync(src).isFile()) continue;
  if (!allowed.has(path.extname(name).toLowerCase())) continue;
  fs.copyFileSync(src, path.join(out, name));
}

fs.writeFileSync(path.join(out, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#111827"><title>My Family Roots</title><style>html,body{margin:0;width:100%;height:100%;overflow:hidden}iframe{display:block;width:100%;height:100%;border:0}</style></head><body><iframe src="family-roots-gallery.html" title="My Family Roots"></iframe></body></html>`);

console.log(`Prepared ${fs.readdirSync(out).length} web assets in www/`);
