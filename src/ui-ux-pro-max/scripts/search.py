#!/usr/bin/env python3
"""Search script that queries a domain and returns results.

Usage:
    python3 search.py "<query>" --domain <domain> [-n <max_results>]

Examples:
    python3 search.py "smart home" --domain example.com
    python3 search.py "dashboard" --domain example.com -n 5
"""

import argparse
import json
import sys
import urllib.error
import urllib.parse
import urllib.request


def build_search_url(query: str, domain: str, max_results: int) -> str:
    params = urllib.parse.urlencode({
        "q": f"site:{domain} {query}",
        "num": max_results,
    })
    return f"https://www.googleapis.com/customsearch/v1?{params}"


def search_duckduckgo(query: str, domain: str, max_results: int) -> list[dict]:
    """Search using DuckDuckGo Instant Answer API as a free fallback."""
    params = urllib.parse.urlencode({
        "q": f"site:{domain} {query}",
        "format": "json",
        "no_redirect": 1,
    })
    url = f"https://api.duckduckgo.com/?{params}"

    req = urllib.request.Request(url, headers={"User-Agent": "SearchScript/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as exc:
        print(f"Error: request failed — {exc}", file=sys.stderr)
        sys.exit(1)

    results = []
    for topic in data.get("RelatedTopics", []):
        if "Text" in topic and "FirstURL" in topic:
            results.append({
                "title": topic["Text"][:120],
                "url": topic["FirstURL"],
            })
        # Nested subtopics
        for sub in topic.get("Topics", []):
            if "Text" in sub and "FirstURL" in sub:
                results.append({
                    "title": sub["Text"][:120],
                    "url": sub["FirstURL"],
                })
        if len(results) >= max_results:
            break

    # Also include the Abstract if available
    if data.get("AbstractURL"):
        results.insert(0, {
            "title": data.get("Heading", "Abstract"),
            "url": data["AbstractURL"],
            "snippet": data.get("AbstractText", ""),
        })

    return results[:max_results]


def search_html_scrape(query: str, domain: str, max_results: int) -> list[dict]:
    """Scrape DuckDuckGo HTML results as a more reliable fallback."""
    params = urllib.parse.urlencode({"q": f"site:{domain} {query}"})
    url = f"https://html.duckduckgo.com/html/?{params}"

    req = urllib.request.Request(url, headers={"User-Agent": "SearchScript/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode("utf-8", errors="replace")
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as exc:
        print(f"Error: request failed — {exc}", file=sys.stderr)
        sys.exit(1)

    results = []
    # Simple extraction of result links from DuckDuckGo HTML
    import re

    for match in re.finditer(
        r'<a rel="nofollow" class="result__a" href="([^"]+)"[^>]*>(.*?)</a>',
        html,
    ):
        href = match.group(1)
        title = re.sub(r"<[^>]+>", "", match.group(2)).strip()
        if href and title:
            results.append({"title": title, "url": href})
        if len(results) >= max_results:
            break

    return results


def print_results(results: list[dict], query: str, domain: str) -> None:
    if not results:
        print(f'No results found for "{query}" on {domain}')
        return

    print(f'\nSearch results for "{query}" on {domain}:')
    print("=" * 60)
    for i, r in enumerate(results, 1):
        print(f"\n{i}. {r['title']}")
        print(f"   {r['url']}")
        if r.get("snippet"):
            print(f"   {r['snippet'][:200]}")
    print()


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Search a specific domain for relevant results.",
    )
    parser.add_argument("query", help="Search query string")
    parser.add_argument("--domain", required=True, help="Domain to search within")
    parser.add_argument(
        "-n",
        "--max-results",
        type=int,
        default=10,
        help="Maximum number of results to return (default: 10)",
    )

    args = parser.parse_args()

    if args.max_results < 1:
        parser.error("max results must be at least 1")

    # Try HTML scrape first (more reliable), fall back to instant answer API
    results = search_html_scrape(args.query, args.domain, args.max_results)
    if not results:
        results = search_duckduckgo(args.query, args.domain, args.max_results)

    print_results(results, args.query, args.domain)


if __name__ == "__main__":
    main()
