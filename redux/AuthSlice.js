import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    user: null,
    role: null,
    token: null,
    start_times: null,
    // currentRoute: 'Home',
};


const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.role = null;
            state.token = null;
            // state.currentRoute = null;
        },
        setTime: (state, action) => {
            state.start_times = action.payload;
        }
        // setCurrentRoute: (state, action) => {
        //     state.currentRoute = action.payload;
        // },
    },
})

export const {login, logout, setTime} = authSlice.actions
export default authSlice.reducer;
