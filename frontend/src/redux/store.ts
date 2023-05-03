import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch } from "react-redux";
import rootReducer from "@redux/reducers";
import { pokemonApi } from "@redux/services/pokemon";
import { authApi, logoutApi } from "@redux/services/auth/api";
import { todoApi } from "@redux/services/todo/api";

export const store = configureStore({
    reducer: {
        rootReducer,
        [pokemonApi.reducerPath]: pokemonApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [logoutApi.reducerPath]: logoutApi.reducer,
        [todoApi.reducerPath]: todoApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        pokemonApi.middleware,
        authApi.middleware,
        logoutApi.middleware,
        todoApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
