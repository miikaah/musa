# The app

Musa is a user interface for musa-electron and musa-server made with Create React App.
It is an exploration into how to create a cross-platform music player
utilising Electron and React.

## Development

1. `npm install`
2. `npm run start:electron`
3. Start musa-electron

## Todo

### V4

- fix: Bug in the playlist where moving the last playing song up causes the playlist to start again
- fix: Bug where state file is not read as JSON
- feat: Remember scroll positions in Search
- feat: More complex searches like lock search term + random and genre / year search
- feat: Update flac tags
- feat: Update ogg tags
- feat: Write tags from sratch
- feat: Bulk album tags editor
- feat: Add ReplayGain scanning
- feat: Add Dynamic Range scanning
- feat: Open mp3, flac and ogg files from filesystem
- feat: Drag & drop mp3, flac and ogg files from filesystem

#### Cross platform

- feat: Make sure everything works on Linux
