// taskを一つ一つ表示させるコンポーネント
// propsでタスクのオブジェクトを受け取り表示させるコンポーネント
import { FC, memo } from 'react'
import { useAppDispatch } from '../app/hooks'
import { setEditedTask } from '../slices/todoSlice'
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid"
import { useMutateTask } from '../hooks/useMutateTask'
import { Task } from '../types/types'

interface Props {
    task: Task
}

export const TaskItem: FC<Props> = ({ task }) => {
    const dispatch = useAppDispatch()
    const { deleteTaskMutation } = useMutateTask()
    console.log("rendered TaskItem")

    // deleteTaskMutationがisPendingの時の処理
    if (deleteTaskMutation.isPending) {
        return <div>Deleting...</div>
    }

    return (
        <li className='my-3'>
            <span className='font-bold'>{task.title}</span>
            <span>
                {':'}
                {task.tag_name}
            </span>

            <div className='flex float-right ml-20'>
                <PencilAltIcon
                    className='h-5 w-5 mx-1 text-blue-500 cursor-pointer'
                    onClick={() => {
                        // dispatchでsetEditedTaskを呼び出し、reduxのstateを更新する。
                        // 引数はtypesのeditedTaskで指定されている
                        dispatch(setEditedTask({
                            id: task.id,
                            title: task.title,
                            tag: task.tag
                        }))
                    }}
                />

                <TrashIcon
                    className='h-5 w-5 text-blue-500 cursor-pointer'
                    onClick={() => {
                        // deleteTaskMutationをmutateで呼び出し引数にはtask.idを指定
                        deleteTaskMutation.mutate(task.id)
                    }}
                />
            </div>
        </li>
    )
}