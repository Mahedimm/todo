import React, { FormEvent, Fragment, useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import Button from "@components/ui/button";
import PlusIcon from "@components/icons/plus-icon";
import TodoList from "@components/todoList";
import Modal from "@components/common/modal/modal";
import Input from "@components/ui/input";
import TextArea from "@components/ui/text-area";
import {useAddTodoMutation, useTodosQuery, useUpdateTodoMutation} from "@redux/services/todo/api";

const  initialFormData = {
    _id: "",
    title: "",
    description: "",
    status: "pending",
    priority: "",

}

const Landing: React.FC = () => {
    const router = useRouter();
    const [taskModel, setTaskModal] = useState(false);
    const todos = useTodosQuery({status: "pending", page: 1, perPage: 10});
    const completedTodos = useTodosQuery({status: "completed", page: 1, perPage: 10});
    const [addTodo, { isLoading }] = useAddTodoMutation();
    const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
    const [formData, setFormData] = useState(initialFormData);

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (formData._id){
            updateTodo({
                _id: formData._id,
                data: formData,
                action: async () =>{
                    console.log("update")
                    await setTaskModal(false);
                    await setFormData(initialFormData);
                    await todos.refetch();
                }
            })
        }else {
            const {_id, ...data} = formData;
            addTodo({
                data : data,
                action: async () =>{
                    await setTaskModal(false);
                    await setFormData(initialFormData);
                    await todos.refetch();
                }
            })
        }

    }

    return (
        <Fragment>
            <div className="font-sans leading-normal tracking-normal">
                <div className="flex m-10">
                    <div>
                        <h1 className="text-6xl font-bold tracking-tight">You've got <span className="text-pink-400">{todos?.data?.data?.total} Task </span>today</h1>
                        <p className="text-base font-bold ml-4 border-b-4 border-pink-400">Let's get them done!</p>
                    </div>
                    <Button
                        type="submit"
                        className="h-6 bg-black mt-2 ml-10"
                        onClick={() => setTaskModal(true)}
                    >
                        <span className="flex justify-center items-center text-white text-sm md:text-base font-semibold">
                            <div className="mr-2">
                                 <PlusIcon/>
                            </div>
                            ADD NEW
                        </span>
                    </Button>
                </div>
                <TodoList updateTodo={updateTodo} refetch={todos.refetch} todos={todos?.data?.data?.data} setFormData={setFormData} setTaskModal={setTaskModal}/>
                <div className="flex m-10">
                    <div>
                        <h1 className="text-6xl font-bold tracking-tight border-b-4 border-pink-400 ">Completed</h1>
                    </div>
                </div>
                <TodoList todos={completedTodos?.data?.data?.data} setFormData={setFormData} setTaskModal={setTaskModal} status="complete"/>
            </div>
            <Modal
                open={taskModel}
                onClose={async () => {
                    await setTaskModal(false)
                    await setFormData(initialFormData)
                }}
            >
                <div className="overflow-hidden bg-white mx-auto rounded-lg w-full sm:w-96 md:w-450px border border-gray-300 py-5 px-5 sm:px-8">
                    <div className="text-center mb-6 pt-2.5">
                        <p className="text-sm md:text-base text-body mt-2 mb-8 sm:mb-10">
                            <span className="text-pink-400 text-4xl font-bold border-b-4">
                              {formData?._id ? "Update This Task" :  "Add New Task"}
                            </span>
                        </p>
                    </div>
                        <form
                        onSubmit={onSubmit}
                        className="flex flex-col justify-center"
                        >
                            <div className="flex flex-col space-y-3.5">
                                <h5 className="text-sm font-semibold text-black">Title</h5>
                                <div className="flex">
                                    <Input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={({ target }) => setFormData({ ...formData, title: target.value })}
                                        className="w-full"
                                        inputClassName="rounded-l-none"
                                        placeholderKey="title"
                                        required={true}
                                        variant="solid"
                                        onWheel={event => event.currentTarget.blur()}
                                    />
                                </div>
                                <h5 className="text-sm font-semibold text-black">Description</h5>
                                <TextArea
                                    name="description"
                                    value={formData.description}
                                    onChange={({ target }) => setFormData({ ...formData, description: target.value })}
                                    className="w-full"
                                />
                                <h5 className="text-sm font-semibold text-black">Priority</h5>
                                <div className="w-full z-20">
                                    <select
                                        name="gender"
                                        required={true}
                                        value={formData.priority}
                                        onChange={({ target }) => setFormData({ ...formData, priority: target.value })}
                                        className="py-2 px-4 md:px-5 w-full flex items-center justify-center h-12 bg-blue-lighter border border-gray-300 rounded text-blue-dark"
                                    >
                                        <option value="">Select One</option>
                                        <option key="low" value="low">Low</option>
                                        <option key="high" value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="h-11 md:h-12 bg-black w-full mt-1.5 mt-6"
                            >
                                {isLoading ? "Loading..." : "Save"}
                            </Button>
                    </form>
                </div>
            </Modal>
        </Fragment>
    );
};

export default Landing;