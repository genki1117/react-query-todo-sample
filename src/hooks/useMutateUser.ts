import { useAppDispatch } from "../app/hooks";
import { resetEditedUser } from "../slices/userSlice";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { User } from "../types/types";
import { initialUserData } from "../initialUserData";

export const useMutateUser = () => {
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()

    const createMutationUser = useMutation({
        mutationFn: async (user: Omit<User, 'id'>) => {
            const initialData = [...initialUserData, user]
            return user
        },

        onSuccess: (res) => {
            const previousUsers = queryClient.getQueryData<User[]>([`users`])
            if (previousUsers) {
                queryClient.setQueryData(
                    [`users`],
                    [...initialUserData, res]
                )
            }
            dispatch(resetEditedUser())
        }
    })

    const updateMutationUser = useMutation({
        mutationFn: async (user: User) => {
            return initialUserData.map((initialUser) => initialUser.id === user.id ? user : initialUser)
        },

        onSuccess: (res, variables) => {
            const previousUsers = queryClient.getQueryData<User[]>([`users`])
            if (previousUsers) {
                queryClient.setQueryData(
                    [`users`],
                    previousUsers.map((user) => user.id === variables.id ? variables : user)
                )
            }
            dispatch(resetEditedUser())
        }
    })

    const deleteMutateUser = useMutation({
        mutationFn: async (id: number) => {
            return initialUserData.filter((initUser) => initUser.id !== id)
        },

        onSuccess: (res, variables) => {
            const previousUsers = queryClient.getQueryData<User[]>([`users`])
            if (previousUsers) {
                queryClient.setQueryData(
                    [`users`],
                    previousUsers.filter((user) => user.id !== variables)
                )
            }
        }
    })

    return { createMutationUser, updateMutationUser, deleteMutateUser }

}