// react-queryでデータを参照するhook
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Task } from "../types/types";

export const useQueryTasks = () => {
    // データを取得する関数を定義
    const getTasks = async () => {
        const { data } = await axios.get<Task[]>(`${process.env.REACT_APP_REST_URL}/tasks/`)
        return data
    }
    // returnでuseQueryを指定する
    return useQuery<Task[], Error>({
        queryKey: [`tasks`],
        queryFn: getTasks,
        staleTime: 0,
        // refetchInterval: 5000
    })
}