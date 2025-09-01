import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './features/playerSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['player/setActiveSong'],
        ignoredPaths: ['player.activeSong.audio'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
