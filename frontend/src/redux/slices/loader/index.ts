import {createSlice} from "@reduxjs/toolkit";

interface ILoader {
    loading: boolean;
}

const initialState: ILoader = {
    loading: false,
};

const loaderSlice = createSlice({
    name: "loader",
    initialState,
    reducers: {
        startLoader: (state) => {
            state.loading = true;
        },
        stopLoader: (state) => {
            state.loading = false;
        },
    },
});

export const {startLoader, stopLoader} = loaderSlice.actions;
export default loaderSlice.reducer;
