#!/usr/bin/env python3
"""Turn a rehearsal log into a flow report.

Run the deck as http://localhost:8000/?rehearse=1, talk it through, press r to
save rehearsal.json, then:

    python3 tools/rehearsal-report.py ~/Downloads/rehearsal.json
"""

import json
import re
import sys
from pathlib import Path

DECK = Path(__file__).resolve().parent.parent / "slides" / "deck.md"
STAGE_BUDGET = 17 * 60
# A slide that takes longer than this is either overstuffed or being read aloud.
LONG = 95
# A content slide this fast was skipped rather than delivered.
RUSHED = 12


def sections():
    """Slide index to section, taken from the rails the deck already declares."""
    out = []
    for chunk in re.split(r"(?m)^---$", DECK.read_text()):
        attrs = re.search(r"<!-- \.slide:(.*?)-->", chunk, re.S)
        rail = ""
        if attrs:
            found = re.search(r'data-rail="([^"]*)"', attrs.group(1))
            stage = re.search(r'data-stage="([^"]*)"', attrs.group(1))
            rail = found.group(1) if found else ("liquid" if stage else "")
        out.append(rail)
    first = next((i for i, r in enumerate(out) if r), len(out))
    last = max((i for i, r in enumerate(out) if r), default=-1)
    named = []
    for i, rail in enumerate(out):
        if rail:
            named.append(rail)
        elif i < first:
            named.append("intro")
        elif i > last:
            named.append("closing")
        else:
            named.append("interlude")
    return named


def fmt(seconds):
    return f"{int(seconds // 60)}:{int(seconds % 60):02d}"


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: rehearsal-report.py <rehearsal.json>")
    log = json.loads(Path(sys.argv[1]).read_text())["slides"]
    rails = sections()

    # Consecutive visits to one slide are one delivery: back-and-forth is navigation.
    merged = []
    for entry in log:
        if merged and merged[-1]["n"] == entry["n"]:
            merged[-1]["seconds"] += entry["seconds"]
            merged[-1]["open"] = merged[-1].get("open") or entry.get("open")
        else:
            merged.append(dict(entry))

    total = sum(e["seconds"] for e in merged)
    reason = json.loads(Path(sys.argv[1]).read_text()).get("reason", "unknown")
    reached = max(e["n"] for e in merged)
    complete = reason in ("reached the closing slide", "reached the end")

    print(f"Total {fmt(total)} over {len(merged)} slide visits. Saved because: {reason}.")
    if complete:
        over = total - STAGE_BUDGET
        print(f"That is {fmt(abs(over))} {'over' if over > 0 else 'under'} the {fmt(STAGE_BUDGET)} stage budget.\n")
    else:
        # A partial run cannot be compared to the budget, but it can be projected.
        covered = len(set(e["n"] for e in merged))
        pace = total / covered if covered else 0
        print(f"PARTIAL RUN: reached slide {reached}, {covered} of {len(rails)} slides.")
        print(f"At {pace:.0f}s a slide that projects to about {fmt(pace * len(rails))} for the whole deck,")
        print(f"against a {fmt(STAGE_BUDGET)} budget. Treat the projection as a floor, not a forecast.\n")

    still_open = [e for e in merged if e.get("open")]
    if still_open:
        names = ", ".join(str(e["n"]) for e in still_open)
        print(f"Slide {names} was still on screen when the log was saved, so its time is a lower bound.\n")

    by_section = {}
    for entry in merged:
        rail = rails[entry["n"]] if entry["n"] < len(rails) else "?"
        by_section.setdefault(rail, 0)
        by_section[rail] += entry["seconds"]
    print("By section")
    for rail, seconds in by_section.items():
        share = 100 * seconds / total if total else 0
        print(f"  {rail:9} {fmt(seconds):>6}  {share:4.0f}%")

    print("\nSlowest slides")
    for entry in sorted(merged, key=lambda e: -e["seconds"])[:6]:
        print(f"  {entry['n']:>3}  {fmt(entry['seconds']):>6}  {entry['heading'][:52]}")

    longs = [e for e in merged if e["seconds"] > LONG]
    rushed = [e for e in merged if e["seconds"] < RUSHED]
    if longs:
        print(f"\nOver {LONG}s, so either overstuffed or being read out loud")
        for entry in longs:
            print(f"  {entry['n']:>3}  {fmt(entry['seconds']):>6}  {entry['heading'][:52]}")
    if rushed:
        print(f"\nUnder {RUSHED}s, so passed over rather than delivered")
        for entry in rushed:
            print(f"  {entry['n']:>3}  {entry['seconds']:>5}s  {entry['heading'][:52]}")

    print("\nEvery slide, in the order it was delivered")
    for entry in merged:
        bar = "#" * max(1, int(entry["seconds"] / 5))
        print(f"  {entry['n']:>3}  {fmt(entry['seconds']):>6}  {bar} {entry['heading'][:44]}")


if __name__ == "__main__":
    main()
