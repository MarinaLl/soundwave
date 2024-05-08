// actions/favoriteSongsActions.js
import { ADD_FAVORITE_SONG, REMOVE_FAVORITE_SONG } from './types';

export const addFavoriteSong = (songId) => ({
  type: ADD_FAVORITE_SONG,
  payload: songId
});

export const removeFavoriteSong = (songId) => ({
  type: REMOVE_FAVORITE_SONG,
  payload: songId
});
