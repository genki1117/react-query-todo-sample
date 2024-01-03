// Tagの新規作成、更新をuseMutationを使用したhook
import axios from "axios";
import { useAppDispatch } from "../app/hooks";
import { resetEditedTag } from "../slices/todoSlice";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Tag } from "../types/types";


export const useMutateTag = () => {
    // reduxの関数を使用する為に呼び出し
    const dispatch = useAppDispatch()
    // react-queryを使用する為に呼び出し
    // キャッシュにアクセスする為
    const queryClient = useQueryClient()

    // tagの新規作成の関数をuseMutateで作成する
    const createTagMutation = useMutation({
        // ジェネリクスでtagの型を指定する
        // tagの型はidを含んでいるが新規作成にはidが必要無いのでomitで除外する。
        mutationFn: (tag: Omit<Tag, 'id'>) =>
            // returnを省略する為に{}は使用していない
            // axiosのエンドポイントを実施し、第二引数に引数のtag(idが除外されている)を渡す。
            axios.post(`${process.env.REACT_APP_REST_URL}/tags/`, tag),

        // 成功した時の処理
        // 引数にはaxiosのレスポンスが代入される。
        onSuccess: (res) => {
            // getQueryDataでキーを指定し、キャッシュのデータを取得する。
            const previousTags = queryClient.getQueryData<Tag[]>([`tags`])
            if (previousTags) {
                // setQueryDataの第一引数に配列でキーを指定し
                queryClient.setQueryData(
                    [`tags`],
                    // スプレッド演算子で配列を展開し、res.dataで新しいオブジェクトを追加し新しい配列を作成する。
                    [...previousTags, res.data]
                )
                dispatch(resetEditedTag())
            }
        }
    })

    // tagの更新関数をuseMutationで作成する
    const updateTagMutation = useMutation({
        // putメソッドで更新用のエンドポイントにアクセスする
        // 第二引数に更新する新しいオブジェクトを指定する。
        mutationFn: (tag: Tag) => axios.put<Tag>(`${process.env.REACT_APP_REST_URL}/tags/`, tag),

        // 第一引数雨のresにはaxiosでアクセスしたエンドポイントの返り値が入る
        // 第二引数にはaxiosに渡したオブジェクト mutationFnの引数
        onSuccess: (res, variables) => {
            // getQueryDataでキーを指定し、キャッシュのデータを配列で取得する。
            // ジェネリクスで返り値の方を指定する。
            const previousTags = queryClient.getQueryData<Tag[]>([`tags`])

            // キャッシュのデータが取得できれば
            if (previousTags) {
                // setQueryDataでキャッシュをセットする。
                // 第一引数に配列でキーを指定
                // 第二引数はセットする配列を指定する
                // mapでリターンされる内容は新しい配列
                queryClient.setQueryData(
                    [`tags`], previousTags.map((tag) => tag.id === variables.id ? res.data : tag))
            }
        }
    })

    // tagの削除関数をuseMutationで作成
    const deleteTagMutation = useMutation({
        mutationFn: (id: number) => axios.delete<Tag>(`${process.env.REACT_APP_REST_URL}/tags/${id}/`),

        onSuccess: (res, variables) => {
            const previousTags = queryClient.getQueryData<Tag[]>([`tags`])
            if (previousTags) {
                queryClient.setQueryData(
                    [`tags`],
                    previousTags.filter((tag) => tag.id !== variables)
                )
            }
        }
    })

    return { createTagMutation, updateTagMutation, deleteTagMutation }
}