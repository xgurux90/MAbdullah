// Builds img/../search.json from the finished pages: projects, expertise bullets,
// skills, NFPA standards and sections, for the "/" quick search.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const strip = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;/g, '’').replace(/\s+/g, ' ').trim();

function build(page, lang) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    const items = [];
    const add = (type, title, detail, anchor) => { if (title) items.push({ t: type, n: title, d: detail || '', a: anchor }); };
    const section = (id) => html.match(new RegExp(`<section[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/section>`))?.[1] || '';

    // Sections
    for (const m of html.matchAll(/<a href="(#[a-z-]+)" class="nav-link">([^<]+)<\/a>/g)) add('section', strip(m[2]), '', m[1]);

    // Projects (cards) and map sites
    for (const m of section('projects').matchAll(/<article class="project-card[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<p[^>]*>([\s\S]*?)<\/p>/g)) add('project', strip(m[1]), `${strip(m[2])} — ${strip(m[3])}`, '#projects');
    const sites = html.match(/id="map-sites">([\s\S]*?)<\/script>/);
    if (sites) for (const site of Object.values(JSON.parse(sites[1]))) for (const [title, detail] of site.projects) add('project', strip(title), `${strip(site.name)} · ${strip(detail)}`, '#projects');

    // Expertise bullets, commercial chips, OEMs
    for (const m of section('expertise').matchAll(/<li class="flex gap-2">[\s\S]*?<span>([\s\S]*?)<\/span><\/li>/g)) add('expertise', strip(m[1]), '', '#expertise');
    for (const m of section('expertise').matchAll(/<span class="bg-off px-3[^>]*>([^<]+)<\/span>/g)) add('skill', strip(m[1]), '', '#expertise');
    for (const m of section('expertise').matchAll(/<p class="font-semibold leading-relaxed mt-1" dir="ltr">([^<]+)<\/p>/g)) for (const oem of m[1].split('·')) add('oem', strip(oem), '', '#expertise');

    // Roles and case studies
    for (const m of section('experience').matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*><bdi>([\s\S]*?)<\/bdi><\/p>/g)) add('role', strip(m[1]).replace(/\s*(Current|حاليًا)$/, ''), strip(m[2]), '#experience');
    for (const m of section('case-studies').matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/g)) add('case', strip(m[1]), strip(m[2]), '#case-studies');

    // Standards mentioned anywhere
    const standards = new Set([...strip(html).matchAll(/NFPA\s?\d+[A-Z]?/g)].map((m) => m[0].replace(/\s+/, ' ')));
    for (const std of standards) add('standard', std, '', '#expertise');

    // Hazards in the selector
    for (const m of section('selector').matchAll(/<button type="button" class="haz-btn"[^>]*>[\s\S]*?<span>([^<]+)<\/span><\/button>/g)) add('hazard', strip(m[1]), '', '#selector');

    // Dedupe
    const seen = new Set();
    const out = items.filter((i) => { const k = i.t + i.n.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
    fs.writeFileSync(path.join(root, `search-${lang}.json`), JSON.stringify(out));
    return out.length;
}

console.log('search index: en', build('index.html', 'en'), 'ar', build('ar.html', 'ar'));
