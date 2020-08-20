# The app

Musa is a user interface for musa-electron made with Create React App.
It is an exploration into how to create a cross-platform music player
utilising Electron and React.

## Development

1. `npm install`
2. `npm start`
3. Start musa-electron

## Todo

### V1

- refactor: Toaster as the animate action is no longer needed
- refactor: Move initial file system scan off of main thread as it lags during startup on Windows

#### Cross platform

- feat: Make sure everything works on Linux

### V2

- feat: Write tags to music files
- feat: Add ReplayGain scanning
- feat: Add Dynamic Range scanning

#### Reduce build size

- feat: Replace ffprobe-static with a smaller solution

#### Cross platform

- feat: Open mp3, flac and ogg files from filesystem
- feat: Drag & drop mp3, flac and ogg files from filesystem
