import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosSecureInstance } from "common/axios";

import { ActExtendedResponse, FailedReqMsg } from "types/novel-server.types";

import { RootState } from "common/store/store";

interface UserState {
  act: ActExtendedResponse["data"] | null;
  isActLoading: boolean;
  isCachedImgsLoaded: boolean;
  isGameMenuBgLoaded: boolean;
  currentGame: {
    currentSceneIndex: number;
    currentDialogIndex: number;
    isTextRevealed: boolean;
  };
}

const initialState: UserState = {
  act: null,
  isActLoading: false,
  isCachedImgsLoaded: false,
  isGameMenuBgLoaded: false,
  currentGame: {
    currentSceneIndex: 0,
    currentDialogIndex: 0,
    isTextRevealed: false,
  },
};

export const fetchAct = createAsyncThunk(
  "game/fetchAct",
  async (actId: string, { rejectWithValue }) => {
    try {
      const response = await axiosSecureInstance.get(`/acts/${actId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as FailedReqMsg).message);
    }
  }
);

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    deleteActData: (state) => {
      state.act = null;
      state.isActLoading = false;
    },
    setIsGameMenuBgLoaded: (state, action) => {
      state.isGameMenuBgLoaded = action.payload;
    },
    setIsCachedImgsLoaded: (state, action) => {
      state.isCachedImgsLoaded = action.payload;
    },
    increaseCurrentSceneIndex: (state) => {
      state.currentGame.currentSceneIndex =
        state.currentGame.currentSceneIndex + 1;
    },
    increaseCurrentDialogIndex: (state) => {
      state.currentGame.currentDialogIndex =
        state.currentGame.currentDialogIndex + 1;
    },
    resetCurrentSceneIndex: (state) => {
      state.currentGame.currentSceneIndex = 0;
    },
    resetCurrentDialogIndex: (state) => {
      state.currentGame.currentDialogIndex = 0;
    },
    setIsTextRevealed: (state, action) => {
      state.currentGame.isTextRevealed = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAct.pending, (state) => {
      state.isActLoading = true;
    });
    builder.addCase(fetchAct.rejected, (state) => {
      state.act = null;
      state.isActLoading = false;
    });
    builder.addCase(fetchAct.fulfilled, (state, action) => {
      state.act = action.payload.data;
      state.isActLoading = false;
    });
  },
});

export const {
  deleteActData,
  setIsGameMenuBgLoaded,
  setIsCachedImgsLoaded,
  increaseCurrentDialogIndex,
  increaseCurrentSceneIndex,
  resetCurrentDialogIndex,
  resetCurrentSceneIndex,
  setIsTextRevealed,
} = gameSlice.actions;

export const selectAct = (state: RootState) => state.game;
export const selectCurrentSceneIndex = (state: RootState) =>
  state.game.currentGame.currentSceneIndex;
export const selectCurrentDialogIndex = (state: RootState) =>
  state.game.currentGame.currentDialogIndex;
export const selectIsTextRevealed = (state: RootState) =>
  state.game.currentGame.isTextRevealed;
export const selectIsCachedImgsLoaded = (state: RootState) =>
  state.game.isCachedImgsLoaded;
export const selectIsGameMenuBgLoaded = (state: RootState) =>
  state.game.isGameMenuBgLoaded;

export default gameSlice.reducer;
