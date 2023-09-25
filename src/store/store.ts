import { configureStore } from '@reduxjs/toolkit';
import { DataSlice } from './features/dataSlice';
import { TypedUseSelectorHook,useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
    reducer:{
        data:DataSlice.reducer
    }
});

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector:TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;
export type RootState = ReturnType<typeof store.getState>;