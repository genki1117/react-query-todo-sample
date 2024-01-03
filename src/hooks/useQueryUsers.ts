// react-queryでデータを参照するhook
import { useQuery } from "@tanstack/react-query";
import { User } from "../types/types";
import { initialUserData } from "../initialUserData";

export const useQueryUsers = () => {

    const getUsers = async () => {
        const data = initialUserData
        return data
    }

    return useQuery<User[], Error>({
        queryKey: ['users'],
        queryFn: getUsers,
        staleTime: 60000
    })
}
