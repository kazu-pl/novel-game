import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosSecureInstance } from "common/axios";

import {
  ActExtendedResponse,
  ExtendedGameSaveResponse,
  FailedReqMsg,
  RequestGameSave,
} from "types/novel-server.types";

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
  gameSaves: {
    data: ExtendedGameSaveResponse["data"] | null;
    isLoading: boolean;
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
  gameSaves: {
    data: null,
    isLoading: false,
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

export const saveGame = createAsyncThunk(
  "game/saveGame",
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const currentSceneIndex = state.game.currentGame.currentSceneIndex;
    const currentDialogIndex = state.game.currentGame.currentDialogIndex;

    try {
      await axiosSecureInstance.post(`/users/me/game-saves`, {
        actId: state.game.act!._id,
        actTitle: state.game.act!.title,
        sceneIndex: currentSceneIndex,
        dialogIndex: currentDialogIndex,
        characterSayingText:
          state.game.act!.scenes[currentSceneIndex].dialogs[currentDialogIndex]
            .characterSayingText,
        text: state.game.act!.scenes[currentSceneIndex].dialogs[
          currentDialogIndex
        ].text,
      } as RequestGameSave);
    } catch (error) {
      return rejectWithValue((error as FailedReqMsg).message);
    }
  }
);

export const fetchGameSaves = createAsyncThunk(
  "game/fetchGameSaves",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosSecureInstance.get(`/users/me/game-saves`);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as FailedReqMsg).message);
    }
  }
);

export const deleteGameSave = createAsyncThunk(
  "game/deleteGameSave",
  async (saveId: string, { rejectWithValue }) => {
    try {
      const response = await axiosSecureInstance.delete(
        `/users/me/game-saves/${saveId}/delete`
      );
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
    setCurrentSceneIndex: (state, action) => {
      state.currentGame.currentSceneIndex = action.payload;
    },
    setCurrentDialogIndex: (state, action) => {
      state.currentGame.currentDialogIndex = action.payload;
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
    resetGameSaves: (state) => {
      state.gameSaves = {
        data: null,
        isLoading: false,
      };
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
    builder.addCase(fetchGameSaves.pending, (state) => {
      state.gameSaves.isLoading = true;
    });
    builder.addCase(fetchGameSaves.rejected, (state) => {
      state.act = null;
      state.gameSaves.isLoading = false;
    });
    builder.addCase(fetchGameSaves.fulfilled, (state, action) => {
      state.gameSaves.data = action.payload.data;
      state.gameSaves.isLoading = false;
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
  setCurrentSceneIndex,
  setCurrentDialogIndex,
  resetGameSaves,
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
export const selectGameSaves = (state: RootState) => state.game.gameSaves;

export default gameSlice.reducer;
