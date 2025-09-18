import { useCallback } from "react";

export const useTaskLongPress = () => {
    return useCallback(
        () => {
            console.log("LONG TAP ACTION");
        }
    ,[]);
}