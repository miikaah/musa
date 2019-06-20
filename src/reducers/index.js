import { combineReducers } from "redux"
import player from "./player.reducer"
import library from "./library.reducer"

export default combineReducers({
  player,
  library
})
