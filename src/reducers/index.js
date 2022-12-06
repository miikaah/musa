import { combineReducers } from "redux";
import player from "./player.reducer";
import library from "./library.reducer";
import toaster from "./toaster.reducer";
import settings from "./settings.reducer";
import search from "./search.reducer";
import visualizer from "./visualizer.reducer";

export default combineReducers({
  player,
  library,
  toaster,
  settings,
  search,
  visualizer,
});
