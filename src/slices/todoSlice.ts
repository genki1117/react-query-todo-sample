import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { EditTask, Tag } from '../types/types';

export interface TaskState {
    editedTask: EditTask
    editedTag: Tag
}

const initialState: TaskState = {
    editedTask: {
        id: 0,
        title: '',
        tag: 0
    },
    editedTag: {
        id: 0,
        name: ''
    }
};

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        // 変更したいタスクの内容をreduxに登録する。
        setEditedTask: (state, action: PayloadAction<EditTask>) => {
            state.editedTask = action.payload
        },
        // redux内のstateをリセットする
        resetEditedTask: (state) => {
            state.editedTask = initialState.editedTask
        },
        setEditedTag: (state, action: PayloadAction<Tag>) => {
            state.editedTag = action.payload
        },
        resetEditedTag: (state) => {
            state.editedTag = initialState.editedTag
        }
    },
    
});

// exportして他のコンポーネントから使用できるようにする
export const { setEditedTask, resetEditedTask, setEditedTag, resetEditedTag } = taskSlice.actions;

// editedTagの内容を返す関数
export const selectTag = (state: RootState) => state.task.editedTag;
// editedTaskの内容を返す関数
export const selectTask = (state: RootState) => state.task.editedTask;

export default taskSlice.reducer;
