import Task from "@/src/types/task";
import { useCallback } from "react";

export const useTaskLongPress = () => {
    return useCallback(
        (task: Task) => {
            console.log("DISPATCHING TASK AS LONG PRESS ACTION PAYLOAD:", task)
        },[]);
}