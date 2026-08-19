#!/usr/bin/env python3
"""Render slides/deck.md into a slide-by-slide talk track.

Generated output, never hand-edited: the speaker notes in deck.md are the single
source of truth, so this stays in step with the deck by construction.

    python3 tools/talk-track.py > TALK-TRACK.md
"""

import html
import re
import sys
from pathlib import Path

DECK = Path(__file__).resolve().parent.parent / "slides" / "deck.md"


def strip_markup(text):
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    return html.unescape(text).strip()


def heading_of(chunk):
    for pattern in (r"(?m)^# (.+)$", r"(?m)^## (.+)$"):
        match = re.search(pattern, chunk)
        if match:
            return strip_markup(match.group(1))
    punch = re.search(r'class="punch">(.+?)</p>', chunk, re.S)
    if punch:
        return strip_markup(punch.group(1)) + "  (picture only)"
    return "(no heading)"


def attrs_of(chunk):
    match = re.search(r"<!-- \.slide:(.*?)-->", chunk, re.S)
    if not match:
        return {}
    found = dict(re.findall(r'([\w-]+)="([^"]*)"', match.group(1)))
    return {k: v for k, v in found.items() if k in ("data-rail", "data-stage", "class")}


def notes_of(chunk):
    match = re.search(r"(?m)^Note:\n(.*)$", chunk, re.S)
    return match.group(1).strip() if match else ""


LEAD_IN = re.compile(r"^(?:\[[A-Z ]+\]|[A-Z][A-Z ,]{4,}|Leaves the question|Then hand off|Then close)")


def paragraphs(notes):
    """Notes are written as wrapped lines. A new point starts at a capitalised
    lead-in, but only where the previous line actually finished a sentence:
    an ALL-CAPS word can wrap onto the next line mid-sentence, and splitting
    there truncated the point."""
    out, current = [], []
    for line in notes.splitlines():
        line = line.strip()
        previous_closed = not current or current[-1].endswith((".", "?", ":", "!"))
        if current and previous_closed and LEAD_IN.match(line):
            out.append(" ".join(current))
            current = []
        current.append(line)
    if current:
        out.append(" ".join(current))
    return out


def main():
    chunks = re.split(r"(?m)^---$", DECK.read_text())
    slides = []
    for index, chunk in enumerate(chunks):
        slides.append(
            {
                "n": index,
                "heading": heading_of(chunk),
                "attrs": attrs_of(chunk),
                "notes": notes_of(chunk),
            }
        )

    print("# Talk track, slide by slide")
    print()
    print("**Generated file. Do not edit.** The speaker notes in `slides/deck.md` are the source of")
    print("truth; this is a readable projection of them for rehearsal. Regenerate with:")
    print()
    print("```")
    print("python3 tools/talk-track.py > TALK-TRACK.md")
    print("```")
    print()
    print("While presenting, press `s` in the deck for the same notes beside the slide, with a timer.")
    print(f"Currently {len(slides)} slides, {sum(len(s['notes'].split()) for s in slides)} words of notes.")
    print()
    print("## The question chain")
    print()
    print("The deck's organising principle is that every slide raises the question the next one answers.")
    print("This table is extracted from the notes, so a blank cell is a seam worth looking at.")
    print()
    print("| # | Slide | Leaves the room asking |")
    print("|---|---|---|")
    for slide in slides:
        question = ""
        for para in paragraphs(slide["notes"]):
            if para.startswith("Leaves the question"):
                question = re.sub(r"^Leaves the question[,:]?\s*", "", para)
                question = re.sub(r"^and it (?:opens|is) [^:]*:\s*", "", question)
            elif not question and para.startswith(("Then hand off", "Then close")):
                question = para
        print(f"| {slide['n']} | {slide['heading']} | {question or '—'} |")
    print()
    print("## Slide by slide")
    for slide in slides:
        print()
        print(f"### {slide['n']} · {slide['heading']}")
        if slide["attrs"]:
            bits = ", ".join(f"`{k}={v}`" for k, v in slide["attrs"].items())
            print()
            print(f"*{bits}*")
        print()
        points = paragraphs(slide["notes"])
        if not points:
            print("_No notes._")
            continue
        for para in points:
            print(f"- {para}")


if __name__ == "__main__":
    main()
