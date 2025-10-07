import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import { type RootState } from "../../store/store";

interface AuthState {
  token: string | null;
}

interface CredentialsPayload {
  accessToken: string;
}

const initialState: AuthState = {
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialsPayload>) => {
      state.token = action.payload.accessToken;
    },
    logout: (state) => {
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
