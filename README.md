# The app

Musa is a user interface for musa-electron and musa-server made with Create React App.
It is an exploration into how to create a cross-platform music player
utilising Electron and React. It supports mp3, flac and ogg files and
jpeg, png and webp images.

## Development

1. `npm install`
2. `npm run start:electron`
3. Start musa-electron

## Todo

### V4

- fix: genre find can have empty results
- fix: Prevent popping when changing FIR eq
- feat: Update slider rgb when choosing colors
- feat: Update ogg tags
- feat: View for seeing files with missing tags / covers
- feat: Write tags from sratch
- feat: Make library and tag updates work without refresh
- feat: Bulk album tags editor + deduce tags from filename
- feat: Add a spectrograph
- feat: Add peak and rms indicators
- feat: Add ReplayGain scanning
- feat: Move items in playlist with pointer long click
- feat: Make navigation work with keyboard
- feat: Responsive mobile layout
- feat: Language selector and i18n
- feat: Placeholder images
- feat: Create srcset of album covers
- investigate: Script for downloading all impulse responses from AutoEQ repo?
- investigate: How hard is it to write a rudimentary multiband compressor?
- feat: Open mp3, flac and ogg files from filesystem
- feat: Add Dynamic Range scanning

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

because reading metadata is an expensive operation especially on Windows
before filesystem caches have been refreshed (read: after restart), while
reading the folder structure is very fast, so changes to the library folder files
are faster to determine based on the structure and file stats than by updating metadata.

All the other APIs and stuffs do use the metadata however and as a fallback
what's on the filesystem, like filename.
