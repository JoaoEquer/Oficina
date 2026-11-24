---
name: yt-edit
description: >-
  Turn a raw recording's transcript into an edit decision list - dead air,
  filler cues and retakes, with timecodes. Use for "edit this", "cut the
  dead space", "tighten this video", "I rambled", or any request to shorten
  footage from a transcript.
---

# yt-edit

An edit decision list from a timestamped transcript. It prints the cuts. You apply them.

```bash
python3 deadair.py transcript.srt              # srt, vtt or whisper json
python3 deadair.py transcript.srt --floor 0.35 --json
```

No transcript yet? Ask for one, or produce one first - `whisper`, `faster-whisper`, or the caption
track YouTube generates on an unlisted upload all work. Do not guess at timings.

## What it finds

- **DEAD** - gaps longer than the floor, trimmed from the MIDDLE so both sides keep a breath.
  Cutting flush against speech is what makes a tightened take sound gasping.
- **FILLER** - cues that are nothing but "um", "so yeah", "basically".
- **REPEAT** - a sentence restarted. Compared against the last cue that was actually speech, not
  the literal previous cue, because most retakes have an "um" between the two attempts. The earlier
  take is the cut; the last attempt is the one kept, because the last one is usually the clean one.

## Applying the cuts (only when asked)

The report is the default. When the user asks you to cut the file too:

1. Show the full text that will survive, in order, and wait for an OK. Approving words is faster than
   approving timecodes.
2. Only remove. Never reorder, rewrite or merge lines; that is a different edit and needs its own ask.
3. Cut with ffmpeg and re-encode (`-c:v libx264 -crf 18 -c:a aac` or the source codecs). Do not use
   `-c copy` for this: stream copy can only start a segment on a keyframe, so a cut lands up to a few
   seconds off and the join shows.
4. Save `cut.mp4` plus the transcript of the cut, then check every join for a clipped word or an
   audio click and list the timecodes you are unsure of.
5. Transcription API keys (AssemblyAI, ElevenLabs) go in `.env`, never in the chat.

## What it will not do

It does not touch media. It has no opinion about your B-roll. A 40% cut on the report is a 40% cut
of SPEECH, and if the video has a long silent demo in it that number is wrong - check the report
against the footage before you trust the runtime at the bottom.

## The gate

Nothing here publishes. This skill writes and you publish. Every output ends in a block the user
copies, and the last line of every run is the question: **ship it, or change it?**
