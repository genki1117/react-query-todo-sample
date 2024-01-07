// 新規作成、更新useMutationを使用したhook
import axios from "axios";
import { useAppDispatch } from "../app/hooks";
import { resetEditedTask } from "../slices/todoSlice";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Task, EditTask } from "../types/types";

export const useMutateTask = () => {
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()

    // タスクの新規作成
    const createTaskMutation = useMutation({
        // 登録したい新しいオブジェクトを引数で受け取る
        // mutationFnでcreateのエンドポイントを実施
        mutationFn: (task: Omit<EditTask, 'id'>) => 
            axios.post(`${process.env.REACT_APP_REST_URL}/tasks/`, task),
        
        // mutationFnが成功したら
        onSuccess: (res) => {
            // react-queryからタスクを取得
            const previousTodos = queryClient.getQueryData<Task[]>([`tasks`])
            // タスクが取得できれば
            if (previousTodos) {
                // react-queryのtasksに新しいtaskを追加する
                queryClient.setQueryData<Task[]>(
                    [`tasks`],
                    [...previousTodos, res.data]
                )
            }
            dispatch(resetEditedTask())
        }
    })

    const updateTaskMutation = useMutation({
        // 更新したい新しいオブジェクトを引数で受け取る
        mutationFn: (task: EditTask) => 
            // axiosのputメソッドを実施し、第二引数に更新したいオブジェクトを指定する。
            axios.put<Task>(`${process.env.REACT_APP_REST_URL}/tasks/${task.id}/`, task),
        
        // 第一引数のresにはaxiosの返り値が代入される。※今回作ったAPIだと更新内容のオブジェクトが代入される。
        // 第二引数にはaxiosに渡したオブジェクトが代入される
        onSuccess: (res, variables) => {
            // 既存のキャッシュの内容を取得する
            const previousTodos = queryClient.getQueryData<Task[]>([`tasks`])
            // キャッシュの内容が存在する場合 
            if (previousTodos) {
                // キャッシュの内容を更新する。
                queryClient.setQueryData(
                    [`tasks`],
                    // 取得したキャッシュの内容をmapで展開する
                    previousTodos.map((task) => 
                        // エンドポイントに渡した内容のidが一致する内容だけを書き換える
                        // それ以外の内容は既存の内容
                        // 上記の内容でmapメソッドで配列を作り直している。
                        task.id === variables.id ? res.data : task
                    )
                )
            }
            dispatch(resetEditedTask())
        }
    })

    const deleteTaskMutation = useMutation({
        // 削除したいidを引数で受け取る
        mutationFn: (id: number) => 
            // axiosのdeleteメソッドで対象のidを削除する
            axios.delete(`${process.env.REACT_APP_REST_URL}/tasks/${id}/`),
        
        // 削除に成功した場合
        // variablesはこの場合はidが代入される
        onSuccess: (res, variables) => {
            // 既存のキャッシュのデータをキーを指定し取得する
            const previousTodos = queryClient.getQueryData<Task[]>([`tasks`])
            // 既存のキャッシュが取得できた場合
            if (previousTodos) {
                // キーを指定し、filterメソッドで既存のキャッシュデータの内容を書き換える
                queryClient.setQueryData(
                    [`tasks`],
                    previousTodos.filter((task) => task.id !== variables)
                )
            }
            dispatch(resetEditedTask())
        }
        
    })

    // returnで作った関数をオブジェクト形式で返却する
    return {createTaskMutation, updateTaskMutation, deleteTaskMutation}
}