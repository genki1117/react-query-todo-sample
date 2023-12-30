import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { User } from '../types/types';

export interface UserState {
    editedUser: User
}

const initialState: UserState = {
    editedUser: {
        id: 0,
        username: '',
        email: '',
        password: '',
        created_at: '',
        updated_at: '',
    }
}

export const userSlice = createSlice({
    name: `user`,
    initialState,
    reducers: {
        setEditedUser: (state, action: PayloadAction<User>) => {
            state.editedUser = action.payload
        },
        resetEditedUser: (state) => {
            state.editedUser = initialState.editedUser
        }
    }
})


export const { setEditedUser, resetEditedUser } = userSlice.actions

export const selectUser = (state: RootState) => state.user.editedUser;

export default userSlice.reducer