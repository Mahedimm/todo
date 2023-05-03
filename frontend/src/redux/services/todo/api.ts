import { createApi } from "@reduxjs/toolkit/query/react";
import { Constants } from "@utils/constants";
import {validateStatus, axiosBaseQuery, baseQuery} from "@utils/auth";
import {TodoReq, TodoRes} from "@redux/services/todo/type";

export const todoApi = createApi({
    reducerPath: "todoApi",
    baseQuery: baseQuery({ auth: Constants.AUTH_TYPE.bearer }),
    endpoints: (builder) => ({
        todos: builder.query<TodoRes, string | {status: string}>({
            query: (args) => `${Constants.TODO}/todos?status=${typeof args !== "string" ? args?.status : ""}&page=${args.page}&perPage=${args.perPage}`,
        }),
        addTodo: builder.mutation<TodoRes, TodoReq>({
            query: (args) => ({
                url: `${Constants.TODO}/add-todo`,
                method: 'POST',
                body: args.data,
                validateStatus: (response, result) => validateStatus({ status: response.status, message: result.message, action: args.action, alert: true })
            }),
        }),
        updateTodo: builder.mutation<TodoRes, TodoReq>({
            query: (args) => ({
                url: `${Constants.TODO}/update-todo/${args.data._id}`,
                method: 'PUT',
                body: args.data,
                validateStatus: (response, result) => validateStatus({ status: response.status, message: result.message, alert: true, action: args.action })
            }),
        }),

    }),
})


export const { useTodosQuery, useAddTodoMutation, useUpdateTodoMutation } = todoApi;
