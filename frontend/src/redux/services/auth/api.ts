import { createApi } from "@reduxjs/toolkit/query/react";
import {Constants} from "@utils/constants";
import {setLocalStorage, removeLocalStorage, validateStatus, axiosBaseQuery, baseQuery} from "@utils/auth";
import {SignUp, SignIn, SignInRes, LogOutRes, Renew, LostPassword, ResetPassword} from "./type";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQuery({auth: Constants.AUTH_TYPE.basic}),
    endpoints: (builder) => ({
        signUp: builder.mutation<SignInRes, SignUp>({
            query: (data: SignUp) => ({
                url: `${Constants.AUTH_ENDPOINT}/register`,
                method: 'POST',
                body: data,
                validateStatus: (response, result) => validateStatus({
                    status: response.status,
                    message: result.message,
                    alert: true
                }),
            }),
            transformResponse: async (res: SignInRes) => {
                await setLocalStorage(res);
                return res;
            }
        }),
        signIn: builder.mutation({
            query: (data: SignIn) => ({
                url: `${Constants.AUTH_ENDPOINT}/login`,
                method: 'POST',
                body: data,
                validateStatus: (response, result) => validateStatus({status: response.status, message: result.message, alert: true})
            }),
            transformResponse: async (res: SignInRes) => {
                await setLocalStorage(res);
                return res;
            }
        }),
        renew: builder.mutation<SignInRes, Renew>({
            query: (arg) => ({
                url: `${Constants.AUTH_ENDPOINT}/renew`,
                method: 'POST',
                body: arg.body,
                validateStatus: (response, result: SignInRes) => {
                    if (response.status === 201) {
                        setLocalStorage(result).then(() => arg.render());
                        return true
                    } else {
                        removeLocalStorage(true).then(r => null)
                        return false
                    }
                },
            })
        }),
        lostPassword: builder.mutation({
            query: (data: LostPassword) => ({
                url: `${Constants.AUTH_ENDPOINT}/lost-password`,
                method: 'POST',
                body: data,
                validateStatus: (response, result) => validateStatus({status: response.status, message: result.message, alert: true})
            }),
        }),
        resetPassword: builder.mutation({
            query: (data: ResetPassword) => ({
                url: `${Constants.AUTH_ENDPOINT}/reset-password`,
                method: 'POST',
                body: data,
                validateStatus: (response, result) => validateStatus({status: response.status, message: result.message, alert: true})
            }),
        }),
    }),
});

export const logoutApi = createApi({
    reducerPath: "logoutApi",
    baseQuery: baseQuery({auth: Constants.AUTH_TYPE.bearer}),
    endpoints: (builder) => ({
        logOut: builder.mutation({
            query: (arg: {action: () => void}) => ({
                url: `${Constants.AUTH_ENDPOINT}/logout`,
                method: 'DELETE',
                validateStatus: (response) => {
                    if (response.status === 202) {
                        arg.action()
                        return true
                    } else {
                        removeLocalStorage(true).then(r => null)
                        return false
                    }
                },
            }),
            transformResponse: async (res: LogOutRes) => {
                await removeLocalStorage(true);
                return res;
            }
        }),
    }),
});

export const { useSignUpMutation, useSignInMutation, useRenewMutation, useLostPasswordMutation, useResetPasswordMutation } = authApi;
export const { useLogOutMutation } = logoutApi;
