import { get, startsWith } from "lodash-es";

export const SpotifyImage = {
  Lg: 640,
  Md: 640
};

export const isSpotifyResource = item => {
  return startsWith(item.uri, "spotify");
};

export const getSpotifyImage = (item, size) => {
  if (!item.images && !get(item, "album.images")) return "";
  // Find image for album
  const image = (item.images || []).find(i => i.height === size);
  if (image) return image.url;
  // Find image for track
  if (item.album) {
    const spotifyImage = item.album.images.find(i => i.height === size);
    return spotifyImage && spotifyImage.url;
  }
};

export const getArtists = item => {
  if (item.artist) return item.artist;
  return (item.artists || []).map(a => a.name).join(", ");
};

export const getDate = item => {
  if (item.date) return item.date;
  return item.release_date && item.release_date.split("-")[0];
};
