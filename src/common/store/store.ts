import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
  AnyAction,
} from "@reduxjs/toolkit";
import { Middleware } from "@reduxjs/toolkit";

import userSlice from "core/store/userSlice";
import counterReducer from "../../features/counter/counterSlice";
import gameSlice from "features/game/store/gameSlice";

export const throwMiddleware: Middleware = () => (next) => (action) => {
  next(action);
  if (action?.error) {
    throw action.payload;
  }
};

const combinedReducer = combineReducers({
  user: userSlice,
  counter: counterReducer,
  game: gameSlice,
});

export type RootState = ReturnType<typeof combinedReducer>;

const rootReducer = (rootState: RootState | undefined, action: AnyAction) => {
  if (action.type === "/logout") {
    if (rootState) {
      rootState = undefined;
    }
  }
  return combinedReducer(rootState, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(throwMiddleware),
});

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
