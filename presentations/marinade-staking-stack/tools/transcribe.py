#!/usr/bin/env python3
"""Transcribe a rehearsal recording locally, with timestamps.

    python3 -m venv ~/.venvs/whisper
    ~/.venvs/whisper/bin/pip install faster-whisper
    ~/.venvs/whisper/bin/python tools/transcribe.py ~/Downloads/rehearsal.wav > ~/Downloads/rehearsal.txt

Timestamps are the point: they let the transcript be lined up against
rehearsal.json, so a slide's timing and the words said on it can be read together.

The recording contains material that is deliberately spoken and never written into
this repository, so the transcript belongs in $K or the downloads folder. Never
commit it here.
"""

import sys
from pathlib import Path

MODEL = "small"


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: transcribe.py <audio file> [model]")
    audio = Path(sys.argv[1]).expanduser()
    if not audio.exists():
        sys.exit(f"no such file: {audio}")
    model_size = sys.argv[2] if len(sys.argv) > 2 else MODEL

    try:
        from faster_whisper import WhisperModel
    except ImportError:
        sys.exit(
            "faster-whisper is not installed in this interpreter.\n"
            "  python3 -m venv ~/.venvs/whisper\n"
            "  ~/.venvs/whisper/bin/pip install faster-whisper\n"
            "then run this script with ~/.venvs/whisper/bin/python"
        )

    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    segments, info = model.transcribe(str(audio), language="en", vad_filter=True)

    print(f"# {audio.name}, model {model_size}, {info.duration / 60:.1f} minutes", flush=True)
    for segment in segments:
        stamp = f"{int(segment.start // 60):02d}:{int(segment.start % 60):02d}"
        print(f"[{stamp}] {segment.text.strip()}", flush=True)


if __name__ == "__main__":
    main()
