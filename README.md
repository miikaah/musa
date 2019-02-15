# Musa

UI for Musa-Electron.

## Todo

#### Frontend

- feat: Add progress meter from initial scan
- feat: Persist volume to localStorage
- feat: Show pause icon in playlist when paused
- fix: Bug where playback resumes from beginning after pausing
- feat: Parse year to date if the date is an ISO date
- feat: Restart currently paused song from beginning by double clicking playlist item
- feat: Add a view that recommends random music from library and shows them nicely
- feat: Support replaygain album gain

#### Backend

- feat: Send progress info to frontend
- feat: Persist playlist
- feat: Multiple playlists

#### Playlist

- feat: Remove multiple songs from playlist
- feat: Rearrange playlist items

#### Library

- feat: Add multiple songs to playlist by selection
- feat: Indicate album in library
- feat: Cooler library list items
- feat: Show / hide library

#### Player

- feat: Show DR and loudness reduction gauge in player
- feat: Add currently playing song info to Player UI
- feat: Cooler Player UI

#### Settings

- feat: Customise music library folder path
- feat: Set Replaygain (track / audio / off)

## Done

##### 15.2.2019

- ~~refactor: Restructure library listing data~~
- ~~feat: Consolidate multiple disc album directories to one album dir~~
- ~~feat: Get artist / album name from directory songs' metadata~~
- ~~refactor: Remove NeDB and other big dependencies~~
- ~~feat: Persist library to IndexedDB~~

##### 14.2.2019

- ~~feat: Prevent scroll with space bar~~
- ~~feat: Mute / Unmute with volume button & M key~~

##### 13.2.2019

- ~~feat: Set volume by replaygain~~
- ~~fix: Bug where play and seek input onChange handlers fire twice~~
- ~~feat: Play / Pause with space bar~~
- ~~fix: Duration formatting~~
- ~~feat: Remove zero prefix if duration is under 10 min~~
- ~~feat: Add steps to volume and seek range inputs~~

##### 12.2.2019

- ~~feat: Tweak playlist styles~~
- ~~feat: Volume icon to player~~
- ~~feat: Indicate duration in player (played / duration)~~
- ~~feat: Indicate currently playing song in playlist~~
- ~~feat: Parse duration to 00:00:00 format~~
- ~~feat: Parse track metadata to [disc.]track / total tracks~~
- ~~feat: Use song metadata in front~~
- ~~feat: Better song metadata parsing~~

##### 11.2.2019

- ~~feat: Read metadata from songs in backend~~
- ~~feat: Remove song from playlist~~
