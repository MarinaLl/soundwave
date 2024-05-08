// reducers/favoriteSongsReducer.js
import { ADD_FAVORITE_SONG, REMOVE_FAVORITE_SONG } from '../actions/types';

const initialState = {
  favoriteSongs: []
};

const favoriteSongsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_FAVORITE_SONG:
      return {
        ...state,
        favoriteSongs: [...state.favoriteSongs, action.payload]
      };
    case REMOVE_FAVORITE_SONG:
      return {
        ...state,
        favoriteSongs: state.favoriteSongs.filter(songId => songId !== action.payload)
      };
    default:
      return state;
  }
};

export default favoriteSongsReducer;
