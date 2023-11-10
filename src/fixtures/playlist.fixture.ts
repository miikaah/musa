import { Playlist } from "@miikaah/musa-core";

export const playlistFixture: Playlist = {
  id: "",
  modifiedAt: new Date().toISOString(),
  pathIds: ["foo", "bar"],
  createdByUserId: "foo@example.com",
};
