// react-queryでデータを参照するhook
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Tag } from "../types/types";

export const useQueryTags = () => {
    // Tagを取得する関数を定義
    const getTags = async () => {
        const { data } = await axios.get<Tag[]>(`${process.env.REACT_APP_REST_URL}/tags/`)
        return data
    }

    return useQuery<Tag[], ErrorOptions>({
        queryKey: [`tags`],
        queryFn: getTags,
        staleTime: 60000
    })
}