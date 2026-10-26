# Imagery

Pages made by a model skip pictures because finding them is work. The floor is four real pictures on the page, usually six to twelve. SVG drawings do not count toward it. For software, `inspect.mjs` also counts large canvases and reports framed interface blocks drawn in HTML separately: with enough of them the floor drops from FAIL to a WARN that asks you to confirm they carry the picture role (real data, cropped and scaled like a photograph).

## Order of preference
1. The project's own photographs, footage or product screens.
2. Generated, when an image tool exists and the subject can be shown honestly.
3. Real pictures of the subject's world from open collections, whenever an honest one exists.
4. Drawn in code from the subject itself, for what no honest picture exists of: one consistent flat graphic language, in the palette's real colors.
5. A generic picture only where it fits (the sea for a sea house), never as a stand-in for the subject.
6. Type and color alone.

## Searching open collections
```bash
node <skill>/scripts/assets.mjs "<query>"            # searches Wikimedia Commons, keeps commercial-use licences
node <skill>/scripts/assets.mjs --get <ref> --name hero-map
node <skill>/scripts/assets.mjs --credits             # credit line for the footer
```
Search the inventory, not the category: the street in old postcards, a map of the neighbourhood, the material up close, the trade in engravings, an object of its kind, a botanical plate, a star chart. Look at each result before choosing; the search returns candidates, not recommendations.

Only CC0, public domain, CC BY and CC BY-SA are kept. CC BY and CC BY-SA need the credit; CC BY-SA also asks that an adapted picture carry the same licence. Put the credit line in the footer, small. If a result's description asks for specific credit wording, follow it.

## What a found picture is
It shows the world around the client. It is never presented as the client's own product, room, dish, person or team. Captions say what the picture is ("Harbour wall, Dunbar, 1990"), never what it is not.

## Use
- Large and with intent: one archival photograph as the hero, an engraving enlarged into the page's motif, the real map as the contact section.
- One crop treatment per page (all duotone, or all natural), not a mix.
- Set width and height, give each one an alt text that says what is in it, and compress to under 300 KB for a hero, under 150 KB otherwise (WebP or AVIF with a JPEG fallback).
- When the project has real footage of its own process or product, the first screen shows it at 40% of the screen or more. One muted looping clip with a poster frame is enough; it must not block reading.

## Drawing in code
When no honest picture exists, draw the subject's own objects (its tiles, windows, tools, interface) as one flat graphic language in the palette's real colors, with real detail. A pictogram of the client's product is not a picture of it. If the product is software, show its interface as real HTML fragments with real data that adds up, cropped and scaled like a photograph would be.
