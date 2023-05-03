export type SignUp = {
    firstName: string;
    lastName: string;
    phone: string;
    gender: string;
    email: string;
    password: string;
};

export type SignIn = {
    email: string;
    password: string;
};

export type SignInRes = {
    data: {
        access: {
            token: string,
            expires: string
        },
        refresh: {
            token: string,
            expires: string
        },
        user: {
            _id: string,
            firstName: string,
            lastName: string,
            email: string,
            phone: string
        }
    },
    message: string
}

export type Renew = {
    body: {
        access: string;
        refresh: string;
    },
    render: () => void,
    logout: () => void
};

export type LogOutRes = {
    data: null,
    message: string
}

export type LostPassword = {
    email: string;
};

export type ResetPassword = {
    _id: string;
    password: string;
    newPassword: string;
};