import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: null | { id: number; name: string; role: string };
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
        },
        logout: (state) => {
            state.status = "idle";
            state.user = null;
        },
        setStatus: (state, action) => {
          state.status = action.payload;
        }
    }
})

export const { login, logout, setStatus } = authSlice.actions;
export default authSlice.reducer;   