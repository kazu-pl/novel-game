import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosSecureInstance } from "common/axios";

import { ActExtendedResponse, FailedReqMsg } from "types/novel-server.types";

import { RootState } from "common/store/store";

interface UserState {
  act: ActExtendedResponse["data"] | null;
  isActLoading: boolean;
}

const initialState: UserState = {
  act: null,
  isActLoading: false,
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

export const { deleteActData } = gameSlice.actions;

export const selectAct = (state: RootState) => state.game;

export default gameSlice.reducer;
