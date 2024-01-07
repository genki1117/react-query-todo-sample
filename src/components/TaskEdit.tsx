import { FC, memo, FormEvent } from "react"
import { useAppSelector, useAppDispatch } from "../app/hooks"
import { setEditedTask, selectTask, setEditedTag } from "../slices/todoSlice"
import { useQueryTags } from "../hooks/useQueryTags"
import { useMutateTask } from "../hooks/useMutateTask"

const TaskEdit: FC = () => {
    // useAppSelectorでreduxのeditedTaskのstateを取得する
    // selectTaskはsliceで作成したeditTaskを返却する関数
    const editedTask = useAppSelector(selectTask)

    // dispatchを実行
    const dispatch = useAppDispatch()

    // useQueryTagsを実行し、tag取得のエンドポイントを実行。tagの一覧を取得する
    const { status, data } = useQueryTags()

    // useMutateTaskからcreateTaskMutation, updateTaskMutationをインポートする
    const { createTaskMutation, updateTaskMutation } = useMutateTask()

    // ボタンが押された時に実行する関数
    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (editedTask.id === 0) {
            createTaskMutation.mutate(editedTask)
        } else {
            updateTaskMutation.mutate(editedTask)
        }
    }
    // tagのセレクトの内容をmutationで取得し、展開し変数に格納する。
    const tagOption = data?.map((tag) => (
        <option key={tag.id} value={tag.id}>{tag.name}</option>
    ))
    console.log("rendered TaskEdit")
    
    // tag取得のmutationのステータスの状態の表示内容
    if (status === "pending") return <div>{"...Loading"}</div>
    if (status === "error") return <div>{"Error..."}</div>

    // updateのstatusがisPendingの状態の時の表示
    if (updateTaskMutation.isPending) {
        return <span>Updating...</span>
    }
    
    // createのstatusがisPendingの状態の時の表示
    if (createTaskMutation.isPending) {
        return <span>Creating...</span>
    }
    return (
        <div>
            <form onSubmit={submitHandler}>
                <input
                    className="mb-3 px-3 py-2 border border-gray-300"
                    placeholder="new task?"
                    onChange={(e) => 
                        dispatch(setEditedTask({...editedTask, title: e.target.value}))
                    }
                    type="text"
                    value={editedTask.title}
                />
                <button
                    className="disabled:opacity-40 my-3 mx-3 py-2 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded"
                    disabled={!editedTask.title || !editedTask.tag }
                >
                    { editedTask.id === 0 ? 'Create' : 'Update' }
                </button>
            </form>
            <select
                className="mb-3 px-3 py-2 border border-gray-300"
                value={editedTask.tag}
                onChange={(e) => dispatch(setEditedTask({...editedTask, tag: Number(e.target.value)}))}
            >
                <option value={0}>Tag</option>
                {tagOption}
            </select>
        </div>
    )
}

export const TaskEditMemo = memo(TaskEdit)