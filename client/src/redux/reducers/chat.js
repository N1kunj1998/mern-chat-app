import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";

const initialState = {
    notificationCount: 0,
    newMessageAlert: getOrSaveFromStorage({key: NEW_MESSAGE_ALERT, get: true}) || [
        {
            chatId: "",
            count: 0,
        }
    ]
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        incrementNotificationCount: (state) => {
            state.notificationCount += 1;
        },
        resetNotificationCount: (state) => {
            state.notificationCount = 0;
        },
        setNewMessagesAlert: (state, action) => {
            const index = state.newMessageAlert.findIndex(
                (item) => item.chatId === action.payload.chatId
            );

            if(index !== -1) {
                state.newMessageAlert[index].count += 1;
            } else {
                state.newMessageAlert.push({
                    chatId: action.payload.chatId,
                    count: 1,
                });
            }
        },
        removeNewMessagesAlert: (state, action) => {
            state.newMessageAlert = state.newMessageAlert.filter(
                (item) => item.chatId !== action.payload
            );
        }
    }
});

export default chatSlice;
export const { 
    incrementNotificationCount,
    resetNotificationCount,
    setNewMessagesAlert,
    removeNewMessagesAlert
} = chatSlice.actions;