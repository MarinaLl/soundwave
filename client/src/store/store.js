// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Importa tu reducer raíz

const store = configureStore({
  reducer: rootReducer
});

export default store;
