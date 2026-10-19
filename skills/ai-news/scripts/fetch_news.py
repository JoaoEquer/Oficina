#!/usr/bin/env python3
"""Coleta noticias de IA recentes (AlphaSignal + Hermes AI) e imprime JSON.

So biblioteca padrao. Dedup por URL contra o seen.json da pasta de saida, para cada
rodada trazer so o que e novo. Uso:
  python fetch_news.py [--days 2] [--pages 2] [--out DIR] [--all]
"""
import argparse
import html
import json
import os
import re
import sys
import time
import urllib.request
from datetime import datetime, timedelta, timezone
from xml.etree import ElementTree as ET

UA = 'Mozilla/5.0 (oficina ai-news)'
ALPHA_SITEMAP = 'https://alphasignal.ai/news-sitemap.xml'
HERMES_PAGE = 'https://hermes-ai.net/news/{}'
NS = {
    's': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    'n': 'http://www.google.com/schemas/sitemap-news/0.9',
}


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode('utf-8', 'replace')


def parse_date(value):
    return datetime.fromisoformat(value.replace('Z', '+00:00'))


def alphasignal():
    root = ET.fromstring(get(ALPHA_SITEMAP))
    for url in root.findall('s:url', NS):
        yield {
            'url': url.findtext('s:loc', '', NS).strip(),
            'title': url.findtext('n:news/n:title', '', NS).strip(),
            'date': url.findtext('n:news/n:publication_date', '', NS).strip(),
            'source': 'AlphaSignal',
            'summary': '',
        }


CARD = re.compile(r'<article data-news-card.*?</article>', re.S)


def text(fragment):
    return html.unescape(re.sub(r'<[^>]+>', '', fragment)).strip()


def hermes(pages):
    for n in range(1, pages + 1):
        page = get(HERMES_PAGE.format('' if n == 1 else f'page/{n}/'))
        for card in CARD.findall(page):
            link = re.search(r'<h2[^>]*>\s*<a href="(/news/[^"]+)"[^>]*>(.*?)</a>', card, re.S)
            when = re.search(r'<span[^>]*>([^<]*?)\s*\S\s*<time datetime="([^"]+)"', card)
            if not link or not when:
                continue
            summary = re.search(r'</h2>\s*<p[^>]*>(.*?)</p>', card, re.S)
            yield {
                'url': 'https://hermes-ai.net' + link.group(1),
                'title': text(link.group(2)),
                'date': when.group(2),
                'source': text(when.group(1)) or 'Hermes AI',
                'summary': text(summary.group(1)) if summary else '',
            }
        if n < pages:
            time.sleep(1)  # robots.txt do Hermes pede crawl-delay 1


def norm(title):
    return re.sub(r'[^a-z0-9]', '', title.lower())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--days', type=float, default=2)
    ap.add_argument('--pages', type=int, default=2)
    ap.add_argument('--out', default=os.environ.get('OFICINA_NEWS_DIR', os.path.join(os.path.expanduser('~'), '.oficina', 'news')))
    ap.add_argument('--all', action='store_true', help='ignora o seen.json (repete itens ja vistos)')
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    seen_path = os.path.join(args.out, 'seen.json')
    seen = set()
    if os.path.exists(seen_path) and not args.all:
        with open(seen_path, encoding='utf-8') as f:
            seen = set(json.load(f))

    cutoff = datetime.now(timezone.utc) - timedelta(days=args.days)
    items, errors, titles = [], [], set()
    # Hermes primeiro: ja traz resumo e o publicador original; AlphaSignal so completa.
    for name, source in (('hermes', lambda: hermes(args.pages)), ('alphasignal', alphasignal)):
        try:
            for it in source():
                key = norm(it['title'])
                if not it['url'] or key in titles or it['url'] in seen:
                    continue
                try:
                    if parse_date(it['date']) < cutoff:
                        continue
                except ValueError:
                    pass
                titles.add(key)
                items.append(it)
        except Exception as e:  # uma fonte fora do ar nao derruba a outra
            errors.append(f'{name}: {e}')

    items.sort(key=lambda it: it['date'], reverse=True)
    with open(seen_path, 'w', encoding='utf-8') as f:
        json.dump(sorted(seen | {it['url'] for it in items}), f)
    json.dump({'out': args.out, 'count': len(items), 'errors': errors, 'items': items}, sys.stdout, ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
