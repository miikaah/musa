# Musa

UI for Musa-Electron.

## Todo

#### Frontend

- feat: Set volume by replaygain
- fix: Bug where play and seek input onChange handlers fire twice
- feat: Support flac and ogg
- feat: Mute / Unmute with volume button
- feat: Show pause icon in playlist when paused
- fix: Bug where playback resumes from beginning after pausing
- feat: Parse year to date if the date is an ISO date
- feat: Restart currently paused song from beginning by double clicking playlist item
- feat: Add a view that recommends random music from library and shows them nicely

#### Backend

- feat: Get artist / album name from directory songs' metadata
- feat: Consolidate multiple disc album directories to one album dir
- feat: Better persistence (some kind of hashing? for updating)
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

- feat: Add currently playing song info to Player UI
- feat: Cooler Player UI

## Settings todo

- feat: Customise music library folder

## Done

##### 13.2.2019

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
