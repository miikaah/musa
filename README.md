# The app

Musa is a user interface for musa-electron and musa-server made with Create React App.
It is an exploration into how to create a cross-platform music player
utilising Electron and React. It supports mp3, flac and ogg files and
jpeg, png and webp images.

## Development

1. `npm install`
2. `npm run start:e`
3. Start musa-electron

## Roadmap

- fix: a11y of white highlight for editor and context menu

### Search - new features

- feat: in year search only return artists who have albums or songs in that year
- feat: year dropdown in search bar
- feat: artist-album-song tree filtering via backend
- feat: year..year search

### Native + Perf + DX + a11y

- feat: Improve colors for blue slider track (The Future cover)
- fix: Prevent popping when changing FIR eq
- feat: Open mp3, flac and ogg files from filesystem
- feat: Create srcset of album covers
- chore: Update eslint to v9
- feat: Make navigation work with keyboard

### Playlist

- feat: Scroll down-up on long press select
- feat: Add playlist editor

### Tagging

- refactor: Tagging backend (TagLib)
- feat: Deduce tags from filename
- feat: View for seeing files with missing tags / covers

### DSP

- investigate: Script for downloading all impulse responses from AutoEQ repo?
- refactor: Replace IR selector with dropdown
- investigate: How hard is it to write a rudimentary multiband compressor?
- investigate: EQ

### Library

- feat: Reflect library refresh to frontend

### Cross platform

- feat: Make sure everything works on Linux
- feat: Make linux builds of native addons

### Misc

- feat: metadata tags for proxy playlists

## Stuff to know

Musa expects this folder structure

```
|_Library folder
  |_Artist folder
    |_Artist album folder
      |_Artist album files OR
      |_Album may be split into multiple folders
        |_Artist album multiple folder files
        |_...
    | Artist miscellaneous files
      |_...
  |_...
```

because reading metadata is an expensive operation, while
reading the folder structure is very fast, so changes to the library folder files
are faster to determine based on the structure and file stats than by updating metadata.

All the other APIs and stuffs do use the metadata however and as a fallback
what's on the filesystem, like filename.
