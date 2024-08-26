import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chat", "User", "Message"],
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({ url: "chat/my", credentials: "include" }),
      providesTags: ["Chat"],
    }),

    searchUser: builder.query({
      query: (name) => ({
        url: `user/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    getNotifications: builder.query({
      query: (name) => ({ url: `user/notifications`, credentials: "include" }),
      keepUnusedDataFor: 0, // we are doing this to not cache the notifications
    }),

    chatDetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `chat/${chatId}`;

        if (populate) url += "?populate=true";

        return { url, credentials: "include" };
      },
      providesTags: ["Chat"], // we are doing this to not cache the notifications
    }),

    getMessages: builder.query({
      query: ({ chatId, page }) => 
        ({ url: `chat/message/${chatId}?page=${page}`, credentials: "include" })
      ,
      keepUnusedDataFor: 0,
    }),

    myGroups: builder.query({
      query: () => ({ url: "chat/my/groups", credentials: "include" }),
      providesTags: ["Chat"],
    }),

    availableFriends: builder.query({
      query: (chatId) => {
        let url = `user/friends`;

        if (chatId) url += `?chatId=${chatId}`;

        return { url, credentials: "include" };
      },
      providesTags: ["Chat"], // we are doing this to not cache the notifications
    }),

    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/send-request",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/accept-request",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    
    sendAttachments: builder.mutation({
      query: (data) => ({
        url: "chat/message",
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    newGroup: builder.mutation({
      query: ({name, members}) => ({
        url: "chat/new",
        method: "POST",
        credentials: "include",
        body: { name, members },
      }),
      invalidatesTags: ["Chat"],
    }),

    renameGroup: builder.mutation({
      query: ({chatId, name}) => ({
        url: `chat/${chatId}`,
        method: "PUT",
        credentials: "include",
        body: {name},
      }),
      invalidatesTags: ["Chat"],
    }),

    addGroupMember: builder.mutation({
      query: ({chatId, members}) => ({
        url: `chat/addMembers`,
        method: "PUT",
        credentials: "include",
        body: { chatId, members },
      }),
      invalidatesTags: ["Chat"],
    }),

    removeGroupMember: builder.mutation({
      query: ({chatId, userId}) => ({
        url: `chat/removeMember`,
        method: "PUT",
        credentials: "include",
        body: { chatId, userId },
      }),
      invalidatesTags: ["Chat"],
    }),

    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `chat/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    
    leaveGroup: builder.mutation({
      query: (chatId) => ({
        url: `chat/leave/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export default api;
export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useGetNotificationsQuery,
  useChatDetailsQuery,
  useGetMessagesQuery,
  useMyGroupsQuery,
  useAvailableFriendsQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useSendAttachmentsMutation,
  useNewGroupMutation,
  useRenameGroupMutation,
  useAddGroupMemberMutation,
  useRemoveGroupMemberMutation,
  useDeleteChatMutation,
  useLeaveGroupMutation
} = api;
