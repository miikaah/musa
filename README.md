# The app

Musa is a user interface for musa-electron and musa-server made with Create React App.
It is an exploration into how to create a cross-platform music player
utilising Electron and React. It supports mp3, flac and ogg files and
jpeg, png and webp images.

## Development

1. `npm install`
2. `npm run start:electron`
3. Start musa-electron

## Roadmap

### V4

#### Playlist

- feat: Allow in-bound-to-out-bound select with pointer
- feat: Maintain play status icon in playlist during cut + paste
- feat: Allow deleting many-in-series playlist items with long delete press

#### Normalization

- feat: Add normalization GUI

#### Tagging

- feat: Bulk album tags editor
- feat: Update ogg tags
- feat: Write tags from scratch
- feat: Deduce tags from filename
- feat: Make library and tag updates work without refresh
- feat: View for seeing files with missing tags / covers

#### Search - improvements

- feat: Remove adversarial trash characters like ' from search terms

#### Search - new features

- feat: in year search only return artists who have albums or songs in that year
- feat: year dropdown in search bar
- feat: artist-album-song tree filtering via backend

#### Native + Perf + DX + a11y

- feat: Improve colors for blue slider track (The Future cover)
- fix: Prevent popping when changing FIR eq
- feat: Open mp3, flac and ogg files from filesystem
- feat: Create srcset of album covers
- chore: Update eslint to v9
- feat: Make navigation work with keyboard

### V5

#### DSP

- investigate: Script for downloading all impulse responses from AutoEQ repo?
- investigate: How hard is it to write a rudimentary multiband compressor?
- feat: EQ

#### Cross platform

- feat: Make sure everything works on Linux

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
