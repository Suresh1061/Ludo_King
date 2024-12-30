import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import reduxStorage from "./storage";
import {
     FLUSH,
     PAUSE,
     PERSIST,
     persistReducer,
     PURGE,
     REGISTER,
     REHYDRATE,
} from "redux-persist";
import persistStore from "redux-persist/es/persistStore";

const persistConfig = {
     key: "root",
     storage: reduxStorage,
     whitelist: ["game"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
     reducer: persistedReducer,
     middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
               serializableCheck: {
                    ignoredActions: [FLUSH, REGISTER, REHYDRATE, PAUSE, PURGE, PERSIST],
               },
          }),
});

export const persistor = persistStore(store);
