#!/usr/bin/env python3
#
# Copyright (C) 2026 RoboMaster.
# Illini RoboMaster @ University of Illinois at Urbana-Champaign
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
"""Wrap tutorial pages in the site's layout (no JavaScript).

Works on fresh pandoc output (standalone HTML) and on pages this script has
already processed, so it is safe to re-run. The navigation and footer are
copied from src/html/sponsorship.html to stay in sync with the main site.

Usage:
    scripts/restyle_tutorials.py src/html/tutorials/<name>/index.html [...]
"""

import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE_PAGE = ROOT / "src" / "html" / "sponsorship.html"

CONTENT_START = "<!-- tutorial-content:start -->"
CONTENT_END = "<!-- tutorial-content:end -->"


def site_chrome():
    """Return (nav, footer) HTML from the main site, adapted for no-JS pages."""
    page = SITE_PAGE.read_text(encoding="utf-8")
    nav = page[page.index('<header class="nav">'):page.index("</header>") + len("</header>")]
    footer = page[page.index('<footer class="footer">'):page.index("</footer>") + len("</footer>")]

    nav = nav.replace(' aria-current="page"', "")
    nav = nav.replace('<a href="/tutorials">Tutorials</a>',
                      '<a href="/tutorials/" aria-current="page">Tutorials</a>')
    # CSS-only menu: a hidden checkbox toggled by the hamburger label
    nav = re.sub(
        r'\s*<button class="nav-toggle"[^>]*>.*?</button>',
        '\n            <label for="nav-check" class="nav-toggle" aria-label="Menu"><span></span><span></span></label>',
        nav, flags=re.S)
    nav = nav.replace('<div class="wrap nav-inner">',
                      '<div class="wrap nav-inner">\n'
                      '            <input type="checkbox" id="nav-check" class="nav-check" aria-hidden="true">')
    return nav, footer


def extract(page):
    """Pull metadata and body content out of pandoc or previously wrapped HTML."""
    if CONTENT_START in page:
        body = page[page.index(CONTENT_START) + len(CONTENT_START):page.index(CONTENT_END)]
        meta = {
            "title": re.search(r'<h1 class="doc-title">(.*?)</h1>', page, re.S).group(1),
            "author": re.search(r'data-author="([^"]*)"', page).group(1),
            "email": re.search(r'data-email="([^"]*)"', page).group(1),
            "date": re.search(r'data-date="([^"]*)"', page).group(1),
        }
        pdf = re.search(r'<a class="btn btn-ghost" href="([^"]+\.pdf)"', page)
        meta["pdf"] = pdf.group(1) if pdf else ""
        return meta, clean(body).strip()

    head = page[:page.index("</header>")]
    title = re.search(r'<h1 class="title">(.*?)</h1>', head, re.S).group(1)
    author = re.search(r'<p class="author">([^<]*)', head).group(1).strip()
    email = re.search(r'mailto:([^"]+)"', head)
    date = re.search(r'<p class="date">(?:Last updated:\s*)?([^<]*)</p>', head)
    body = page[page.index("</header>") + len("</header>"):page.index("</body>")]
    pdf = re.search(r"Read the pdf version <a href='([^']+)'>here</a>\.\s*", body)
    if pdf:
        body = body.replace(pdf.group(0), "")
    meta = {
        "title": " ".join(title.split()),
        "author": author,
        "email": email.group(1) if email else "",
        "date": date.group(1).strip() if date else "",
        "pdf": pdf.group(1) if pdf else "",
    }
    return meta, clean(body).strip()


def clean(body):
    """Fix pandoc/PDF artifacts that don't suit the dark theme."""
    # Inline code "pills" were styled with a light-gray background inline
    body = body.replace(
        'style="background-color: lightgray; padding: 2px 4px; border-radius: 3px;"',
        'class="code-pill"')
    body = re.sub(r'\s+data-bgcolor="lightgray"', "", body)
    body = body.replace('style="text-decoration: underline;"', 'class="file-name"')
    body = re.sub(r'<table style="width: ?60%;?">', "<table>", body)

    # URLs hyphen-split across two links by the PDF line breaker
    body = re.sub(
        r'<a\s+href="([^"]+)">([^<]*?)-</a>\s*<a\s+href="\1">([^<]*)</a>',
        lambda m: f'<a href="{m.group(1)}">{m.group(2)}{m.group(3)}</a>',
        body)

    # A single raw TeX expression pandoc couldn't convert
    body = re.sub(
        r'<span\s+class="math inline">\$a_i, b_j \\in \\Z/2\\Z\$</span>',
        '<span class="math inline"><em>a<sub>i</sub></em>, <em>b<sub>j</sub></em> ∈ ℤ/2ℤ</span>',
        body)

    # Figures whose image never made it into the HTML export
    body = re.sub(r"<figure>\s*<figcaption>[^<]*</figcaption>\s*</figure>\s*", "", body)
    return body


def toc_items(body):
    items = []
    for level, anchor, text in re.findall(r'<h([12]) id="([^"]+)"[^>]*>(.*?)</h\1>', body, re.S):
        label = " ".join(re.sub(r"<[^>]+>", "", text).split())
        items.append(f'<li class="toc-h{level}"><a href="#{anchor}">{label}</a></li>')
    return "\n".join(items)


def render(meta, body, nav, footer):
    toc = toc_items(body)
    title_text = html.unescape(re.sub(r"<[^>]+>", "", meta["title"]))
    pdf_btn = (f'<a class="btn btn-ghost" href="{meta["pdf"]}">Download PDF</a>'
               if meta["pdf"] else "")
    email = (f' · <a href="mailto:{meta["email"]}">{meta["email"]}</a>'
             if meta["email"] else "")
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title_text} — Illini RoboMaster Tutorials</title>
    <meta name="description" content="{html.escape(title_text)}: an Illini RoboMaster embedded programming tutorial.">
    <meta name="theme-color" content="#000000">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" href="/static/img/logo_dark_512.png">
    <link rel="apple-touch-icon" href="/static/img/apple-touch-icon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/static/v2/site.css">
    <link rel="stylesheet" href="/static/v2/tutorials.css">
</head>
<body class="doc-page">

    {nav}

    <main>
        <header class="doc-hero" data-author="{meta["author"]}" data-email="{meta["email"]}" data-date="{meta["date"]}">
            <div class="wrap">
                <a href="/tutorials/" class="doc-back">All tutorials</a>
                <h1 class="doc-title">{meta["title"]}</h1>
                <p class="doc-meta">{meta["author"]}{email} · <span>Updated {meta["date"]}</span></p>
                <div class="hero-cta">{pdf_btn}</div>
            </div>
        </header>

        <div class="wrap doc-layout">
            <aside class="toc" aria-label="On this page">
                <p class="eyebrow">On this page</p>
                <ul>
{toc}
                </ul>
            </aside>

            <article class="prose">
                <details class="toc-mobile">
                    <summary>On this page</summary>
                    <ul>
{toc}
                    </ul>
                </details>
{CONTENT_START}
{body}
{CONTENT_END}
            </article>
        </div>
    </main>

    {footer}

</body>
</html>
"""


def main(paths):
    nav, footer = site_chrome()
    for path in map(Path, paths):
        meta, body = extract(path.read_text(encoding="utf-8"))
        path.write_text(render(meta, body, nav, footer), encoding="utf-8")
        print(f"restyled {path}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1:])
