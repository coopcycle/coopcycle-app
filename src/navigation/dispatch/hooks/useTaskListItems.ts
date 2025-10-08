import { useCallback } from "react";

export const useTaskListItems = () => { 
    return useCallback((taskList) => {
        console.log(taskList.items);
        return taskList.items;
    }, [])
}; 