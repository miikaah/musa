import { combineReducers } from "redux";
import player from "./player.reducer";
import library from "./library.reducer";
import profile from "./profile.reducer";
import toaster from "./toaster.reducer";
import settings from "./settings.reducer";
import search from "./search.reducer";
import visualizer from "./visualizer.reducer";

export default combineReducers({
  player,
  library,
  profile,
  toaster,
  settings,
  search,
  visualizer,
});
