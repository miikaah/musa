# The app

Musa is a user interface for musa-electron made with Create React App.
It is an exploration into how to create a cross-platform music player
utilising Electron and React.

## Development

1. Copy `.env.example` to `.env`
2. `npm install`
3. `npm run start`

## Todo

### V1

- feat: Delete DB when starting new Initial scan
- feat: Use react router for changing page to settings and search
- feat: Go to Search when pressing Ctrl + F
- feat: Focus to search input when navigating to Search page
- refactor: Replace redux with React Context API
- refactor: Replace FontAwesome with something else
- refactor: List keys to something other than just index
- refactor: Toaster as the animate action is no longer needed
- refactor: Move initial file system scan off of main thread as it lags during startup on Windows
- feat: Add Splash screen
- feat: add button to collapse all folders in library

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
