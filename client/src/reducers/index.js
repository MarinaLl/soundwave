// reducers/index.js
import { combineReducers } from 'redux';
import favoriteSongsReducer from './favoriteSongsReducer';

const rootReducer = combineReducers({
  // Aquí puedes combinar varios reducers si es necesario
  favoriteSongs: favoriteSongsReducer
});

export default rootReducer;
