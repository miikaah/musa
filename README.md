# Musa

UI for Musa-Electron.

## Todo

#### Frontend

- feat: Show pause icon in playlist when paused
- feat: Add progress meter for initial scan
- feat: Restart currently paused song from beginning by double clicking playlist item
- feat: Generate playlist (genre, random)
- feat: Support replaygain album gain
- feat: Persist playlist
- feat: Multiple playlists
- fix: A bug where Electron Helper starts using tons of CPU (???)
- feat: Search
- feat: Add a view that recommends random music from library and shows them nicely

#### Backend

- feat: Parse year from date if the date is an ISO date
- feat: Send progress info to frontend

#### Playlist

- feat: Remove multiple songs from playlist
- feat: Rearrange playlist items

#### Library

- feat: Indicate album in library
- feat: Cooler library list items

#### Player

- feat: Show DR and loudness reduction gauge in player
- feat: Add currently playing song info to Player UI
- feat: Cooler Player UI

#### Settings

- feat: Customise music library folder path
- feat: Set Replaygain (track / album / off)

#### General

- feat: Create an icon
- feat: Create packaging script

## Done

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
