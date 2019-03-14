import { combineReducers } from "redux";
import player from "./player.reducer";
import library from "./library.reducer";
import palette from "./palette.reducer";
import settings from "./settings.reducer";

export default combineReducers({
  player,
  library,
  palette,
  settings
});
