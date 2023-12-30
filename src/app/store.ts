import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import taskSlice from '../slices/todoSlice'; // todoSliceを読み込み
import  userSlice  from '../slices/userSlice';

export const store = configureStore({
     // reducerを登録
    reducer: {
        task: taskSlice, // taskのキーでsliceを登録
        user: userSlice
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
