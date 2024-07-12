const en: Record<string, string | ((s: string) => string)> = {
  "coverInfo.metadata.genre": "Genre",
  "coverInfo.metadata.normalization.track": "Normalization track",
  "coverInfo.metadata.normalization.album": "Normalization album",
  "coverInfo.metadata.dr.track": "Dynamic range track",
  "coverInfo.metadata.dr.album": "Dynamic range album",
  "coverInfo.metadata.bitrate": "Bitrate",
  "coverInfo.metadata.sampleRate": "Sample rate",
  "library.filter.placeholder": "Filter by artist",
  "modal.title.normalization": "Normalization",
  "modal.closeButton": "Close",
  "playlist.instructions.title": "Drag and drop Artists, Albums and Songs here",
  "playlist.instructions.playControls": "Play controls",
  "playlist.instructions.playPause": "Play / Pause",
  "playlist.instructions.spacebar": "Spacebar",
  "playlist.instructions.mute": "Mute",
  "playlist.instructions.toggleSearch": "Toggle Search",
  "playlist.instructions.playlistControls": "Playlist controls",
  "playlist.instructions.playReplay": "Play / Replay",
  "playlist.instructions.select": "Select",
  "playlist.instructions.clickAndDrag": "Click + Drag",
  "playlist.instructions.selectAll": "Select All",
  "playlist.instructions.cut": "Cut",
  "playlist.instructions.copy": "Copy",
  "playlist.instructions.paste": "Paste",
  "playlist.instructions.remove": "Remove",
  "playlist.instructions.backspaceOrDelete": "Backspace / Delete",
  "playlist.instructions.duplicateSelection": "Duplicate selection",
  "playlist.instructions.moveItemWithPointer": "Move item with pointer",
  "playlist.instructions.longPress": "Long press",
  "playlist.instructions.moveUp": "Move Up",
  "playlist.instructions.upArrow": "Up Arrow",
  "playlist.instructions.moveDown": "Move Down",
  "playlist.instructions.downArrow": "Down Arrow",
  "playlist.instructions.touchControls": "Touch controls",
  "playlist.instructions.doubleTap": "Double tap",
  "playlist.instructions.addFromLibrary": "Add from library",
  "search.input.placeholder": "Search by term",
  "search.action.random": "Random",
  "search.action.clear": "Clear",
  "search.results.artists": "Artists",
  "search.results.albums": "Albums",
  "search.results.songs": "Songs",
  "settings.library.title": "Library",
  "settings.library.path": "Path",
  "settings.library.addNew": "Add new",
  "settings.advanced.title": "Advanced",
  "settings.advanced.normalization": "Normalization",
  "settings.advanced.normalization.track": "Track",
  "settings.advanced.normalization.album": "Album",
  "settings.advanced.normalization.off": "Off",
  "settings.advanced.actions": "Actions",
  "settings.advanced.updateLibrary": "Update library",
  "settings.profile.title": "Profile",
  "settings.theme.title": "Theme",
  "settings.theme.collection": "Collection",
  "settings.theme.noThemes": "No themes yet",
  "settings.theme.currentTheme": "Current theme",
  "settings.theme.removeTheme": "Remove theme",
  "settings.experimental.title": "Experimental",
  "settings.experimental.preAmp": "Pre-amp",
  "settings.experimental.impulseResponseEq": "Impulse response EQ",
  "settings.language.title": "Language",
  "settings.language.en": "English",
  "settings.language.fi": "Finnish",
  "tagEditor.title": "Tag editor",
  "tagEditor.tag.artist": "Artist",
  "tagEditor.tag.title": "Title",
  "tagEditor.tag.album": "Album",
  "tagEditor.tag.year": "Year",
  "tagEditor.tag.track": "Track",
  "tagEditor.tag.tracks": "Tracks",
  "tagEditor.tag.disk": "Disk",
  "tagEditor.tag.disks": "Disks",
  "tagEditor.tag.genre": "Genre",
  "tagEditor.tag.composer": "Composer",
  "tagEditor.tag.codec": "Codec",
  "tagEditor.tag.comment": "Comment",
  "tagEditor.saveButton": "Save",
  "titlebar.location.search": "Search",
  "titlebar.location.settings": "Settings",
  "toast.updatingLibrary": "Updating library",
  "toast.updateComplete": "Update complete",
  "toast.addAlbumOrSongToPlaylist": (album: string) =>
    `Added ${album} to playlist`,
  "toast.createPlaylist": (text: string) => `Copied ${text} to clipboard`,
  "toast.failedToUpdateTags": "Failed to update tags",
  "toast.succeededToUpdateTags": "Tags updated",
  "test.onlyExistsInEnglish": "mock",
};

export default en;
