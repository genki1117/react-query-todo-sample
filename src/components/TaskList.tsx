// taskの一覧を表示するコンポーネント
import { FC, memo } from "react"
import { useQueryTasks } from "../hooks/useQueryTasks"
import { TaskItem } from "./TaskItem"

export const TaskList: FC = () => {
    // useQueryを実行し、statusとdataを変数で受け取る
    // useQueryTaskでaxiosを実行しdataを取得しuseQueryでキャッシュdataを保存する
    // useQueryをそのままreturnしているので変数にはstatusとdataを受け取ることができる
    const { status, data } = useQueryTasks()
    console.log("rendered TaskList")
    if (status === "pending") return <div>{"Loading..."}</div>
    if (status === "error") return <div>{"Error"}</div>
    return (
        <div>
            {data?.map((task) => (
                <div key={task.id}>
                    <ul>
                        <TaskItem task={task} />
                    </ul>
                </div>
            ))}
        </div>
    )
}
