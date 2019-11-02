# Musa

UI for Musa-Electron.

## Development

1. Copy `.env.example` to `.env`
2. `npm install`
3. `npm run start`

## Todo

### V1

- feat: Delete DB when starting new Initial scan
- fix: Play/pause icon disappearing after Cut + Copy etc. because currentIndex changes
- fix: Selections + duplication
- feat: Remember library state (which folders are open)
- refactor: Use react router for changing page to settings and search
- feat: Go to Search when pressing Ctrl + F
- feat: Focus to search input when navigating to Search page
- refactor: Replace redux with React Context API
- refactor: Replace FontAwesome with something else
- refactor: List keys to something other than just index
- refactor: Toaster as the animate action is no longer needed
- refactor: Move initial file system scan off of main thread as it lags during startup on Windows
- feat: Add Splash screen

#### Cross platform

- feat: Make sure everything works on Linux

#### General

- feat: Add license

### V2

- feat: Write tags to music files
- feat: Add ReplayGain scanning
- feat: Add Dynamic Range scanning

#### Reduce build size

- feat: Replace ffprobe-static with a smaller solution
- feat: Use MacGap on Mac (obviously)

#### Cross platform

- feat: Open mp3, flac and ogg files from filesystem
- feat: Drag & drop mp3, flac and ogg files from filesystem

## Done

##### 2.11.2019

It seems the last days changes finally fixed the memory leak(s)!
Note to self: code functional React components properly.

- refactor: Use absolute paths
- refactor: refactor components to styled components
- chore: add babel-plugin-macros and use styled-components/macro
- chore: update all packages
- chore: remove stylelint, dotenv-cli and node-sass

##### 1.11.2019

- refactor: Create useKeyPress hook + put custom hooks in their own file
- refactor: Wrap redux store subscription with useEffect

##### 31.10.2019

- fix: ReplayGain album gain -> track gain fallback
- fix: Space and M key listeners
- refactor: Split Player to smaller components
- refactor: replace seek setInterval in Player with requestAnimationFrame hook

##### 25.10.2019

- feat: Delete items in playlist with Del-key
- chore: Update localhost port
- chore: Update frontend packages
- chore: Update backend packages

##### 20.8.2019

- fix: Clear WebFrame cache every 10 minutes to reduce used memory.

##### 17.7.2019

- feat: Simplify update & deletion logic due to Windows

##### 16.7.2019

- fix: Sorting of songs when there are multiple discs
- fix: Sorting of folders in library when there is more than one library folder
- fix: Some album covers not showing due to casing etc. issues

##### 12.7.2019

- feat: Make sure everything works on Windows
- feat: Add packaging for Windows
- fix: Deleting last library folder in UI
- fix: initial scan on fresh DB after adding library path
- fix: Music library add crashing in Windows
- feat: Use dotenv-cli for environment variables for packaging
- feat: Enable OverlayScrollbar (Mac like scrollbar for Windows)
- feat: Improve styles for Windows
- feat: Get dev environment working in Windows

##### 11.7.2019

- feat: Create an icon

##### 3.7.2019

- feat: Support multiple music library folders
- feat: Customise music library folder path

##### 2.7.2019

- feat: Enable webSecurity in prod

##### 1.7.2019

- fix: Default theme change when no album cover

##### 29.6.2019

- feat: Use Track Replaygain as fallback
- feat: Add Labels for Library
- feat: Styles for select in Replaygain settings
- feat: Instantly unfocus control buttons

##### 26.6.2019

- feat: Support replaygain album gain
- feat: Set Replaygain (track / album / off)

##### 25.6.2019

- feat: Create a different kind of library view that shows album covers
- feat: Add app menu, which enables clipboard
- feat: Disable global key listeners when target is not BODY

##### 24.6.2019

- feat: Add toast for successfully adding to playlist in search
- feat: Persist search query and artefacts to redux state
- feat: Add functionality to Search
- feat: Add styles to Search

##### 21.6.2019

- feat: add more features to search
- fix: Initial scan in frontend

##### 20.6.2019

- refactor: Toolbar buttons to use Refs
- feat: Create a packaging script
- feat: Use default theme if no cover for album or song
- fix: Move stuff from localStorage to indexedDB as localStorage is destroyed on quit on mac

##### 18.6.2019

- feat: Choose default theme from theme library
- feat: Create a theme library
- feat: Scroll to active index if it goes out of viewport
- fix: Initial scan only showing the currently updated artist

##### 7.6.2019

- fix: Some Player bugs

##### 5.6.2019

- feat: Pause music if playlist is empty
- refactor: App to function component
- refactor: PlaylistItem to function component
- refactor: Playlist to function component
- refactor: Player to function component

##### 31.5.2019

- chore: update packages
- fix: Caret not showing in albums that don't have a date
- refactor: Settings & Toolbar to function components
- refactor: LibraryList to function component
- refactor: LibraryItem to function component
- refactor: Library to function component

##### 29.5.2019

- refactor: Cover to function component
- feat: Add progress bar component

##### 28.5.2019

- fix: Problem with filenames that have # chars in them
- feat: Add progress meter for initial scan
- feat: Send progress info to frontend during initial scan
- feat: Proper handling of active index

##### 27.5.2019

- feat: Cut items with Ctrl + X
- feat: Copy items with Ctrl + C
- feat: Paste items with Ctrl + V
- feat: Paste items above current index with Ctrl + Shift + V
- feat: Duplicate items with Ctrl + Shift + D
- feat: Create a new playlist from selected items + Enter
- feat: Select items with Ctrl + click

##### 24.5.2019

- feat: Select items with Shift + click
- feat: Select items with Shift + up / down
- fix: Seeking happening on mouse up as well

##### 15.3.2019

- feat: Make sure highlights have enough contrast compared to background and colors
- refactor: Remove redundant palette reducer

##### 14.3.2019

- feat: Add a button to settings to run initial scan again
- feat: Add settings view
- feat: Parse year from date if the date is an ISO date + add bit rate to metadata
- feat: Show DR gauge in player
- feat: Show pause icon in playlist when paused

##### 13.3.2019

- feat: Replay currently active song with Enter & Double Click
- feat: Start playing item with Enter
- feat: Move active index up / down with keyboard
- feat: Improve mouse selection in playlist
- feat: Select all with Ctrl + A in playlist

##### 12.3.2019

- feat: Watch for image file changes as well
- feat: Select multiple songs in playlist
- feat: Close library when clicking outside of it
- feat: Drag & drop from library to playlist

##### 7.3.2019

- refactor: replace Radium with CSS Variables

##### 1.3.2019

- refactor: separate cover to its own component
- refactor: move player to toolbar

##### 28.2.2019

- feat: Add currently playing song info to document title
- fix: A bug where Electron Helper starts using tons of CPU

```
It was caused by Chokidar not being able to use the native FSEvents
module for Mac and it falling back to polling.
See: https://github.com/paulmillr/chokidar/issues/447

Fixed the issue by rebuilding fsevents with electron-rebuild.
```

- fix: Don't blow up if song metadata can't be read

##### 27.2.2019

- feat: start implementing color scheme by album cover
- fix: dont blow up if folder has no songs + see if not recreating TaskPool all the time helps with Electron CPU usage

##### 26.2.2019

- feat: improve album cover scanning

##### 22.2.2019

- feat: Show / hide library
- feat: new kickass layout
- feat: Add all artist or album songs to playlist by double clicking

##### 21.2.2019

- refactor: replace child_process fork with electron-remote
- feat: update new visual look
- feat: Add path to album cover
- fix: Bug where playback resumes from beginning after pausing (seems to be fixed)

##### 19.2.2019

- feat: Persist volume to localStorage
- feat: Start creating a new visual look

##### 18.2.2019

- feat: Add watchers for adding, modifying & removing of files in library
- feat: Change font to Tahoma
- feat: Add new songs to library during startup
- feat: Remove deleted songs from library during startup
- feat: Update modified songs in library during startup

##### 16.2.2019

- feat: Use chokidar for initial scan
- feat: Use IndexedDB in front for persistence of library

##### 15.2.2019

- refactor: Restructure library listing data
- feat: Consolidate multiple disc album directories to one album dir
- feat: Get artist / album name from directory songs' metadata
- refactor: Remove NeDB and other big dependencies
- feat: Persist library to IndexedDB

##### 14.2.2019

- feat: Prevent scroll with space bar
- feat: Mute / Unmute with volume button & M key

##### 13.2.2019

- feat: Set volume by replaygain
- fix: Bug where play and seek input onChange handlers fire twice
- feat: Play / Pause with space bar
- fix: Duration formatting
- feat: Remove zero prefix if duration is under 10 min
- feat: Add steps to volume and seek range inputs

##### 12.2.2019

- feat: Tweak playlist styles
- feat: Volume icon to player
- feat: Indicate duration in player (played / duration)
- feat: Indicate currently playing song in playlist
- feat: Parse duration to 00:00:00 format
- feat: Parse track metadata to [disc.]track / total tracks
- feat: Use song metadata in front
- feat: Better song metadata parsing

##### 11.2.2019

- feat: Read metadata from songs in backend
- feat: Remove song from playlist
