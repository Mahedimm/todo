
export type TodoReq = {
    data: {
        _id?: string,
        title: string,
        description: string,
        priority: string,
        status: string,
    }
    action?: () => void
}
export type TodoRes = {
    data: {
        _id: string,
        title: string,
        description: string,
        priority: string,
        status: string,
    }[]
    message: string,
    stack?: string,
}