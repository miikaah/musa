export const ADD_TO_PLAYLIST = "MUSA/PLAYLIST/ADD";
export const addToPlaylist = item => ({
  type: ADD_TO_PLAYLIST,
  item
});

export const REMOVE_FROM_PLAYLIST = "MUSA/PLAYLIST/REMOVE";
export const removeFromPlaylist = index => ({
  type: REMOVE_FROM_PLAYLIST,
  index
});

const initialState = {
  items: []
};

const playlist = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_PLAYLIST:
      return {
        ...state,
        items: [...state.items, action.item]
      };
    case REMOVE_FROM_PLAYLIST:
      return {
        ...state,
        items: state.items.splice(action.index, 1)
      };
    default:
      return state;
  }
};

export default playlist;
