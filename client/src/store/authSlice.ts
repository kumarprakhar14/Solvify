import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: null | { id?: number | string; _id?: string; name: string; role: string; email?: string };
  accessToken: string | null;
  status: "idle" | "authenticated" | "unauthenticated";
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: "idle",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = "authenticated";
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },
        logout: (state) => {
            state.status = "unauthenticated";
            state.user = null;
            state.accessToken = null;
        },
        setStatus: (state, action) => {
          state.status = action.payload;
        }
    }
})

export const { login, logout, setStatus } = authSlice.actions;
export default authSlice.reducer;   