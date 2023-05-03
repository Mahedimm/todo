import {FC, Fragment} from "react";
import { motion } from "framer-motion";
import {CheckBox} from "@components/ui/checkbox";

import {BiEdit} from "react-icons/bi";

const TodoList = ({todos, setFormData, setTaskModal, status, updateTodo, refetch}) => {

    const handleUpdateTodo = (todo) => {
        updateTodo({
            _id: todo?._id,
            data: {
                ...todo,
                status: todo?.status === "pending" ? "completed" : "pending"
            },
            action: async () =>{
                await refetch();
            }
        })

    }

    return (
        <Fragment>
            <motion.div
                layout
                initial="from"
                animate="to"
                exit="from"
                //@ts-ignore
                // variants={fadeInTop(0.35)}
                className={`w-full flex flex-col`}
            >
                {
                   status === "complete" ? (
                        <div className="flex flex-col">
                            {
                                todos?.map((todo) => (
                                    <div key={todo?._id} className="flex flex-col items-start ml-10 m-2 justify-center w-[80%] h-[80%] bg-white rounded-md shadow-md">
                                        <h1 className="line-through p-2 text-2xl font-bold  bg-gray-400">{todo?.title}</h1>
                                    </div>
                                ))
                            }
                        </div>
                        ): (
                        <table className="table-auto m-10 w-[80%]">
                            <thead className="text-sm lg:text-base">
                            <tr>
                                <th className="bg-gray-100 text-start p-4 text-heading font-semibold first:rounded-ts-md">
                                    Title
                                </th>
                                <th className="bg-gray-100 text-start p-4 text-heading font-semibold lg:text-center">
                                    Description
                                </th>
                                <th className="bg-gray-100 text-center p-4 text-heading font-semibold  last:rounded-te-md">
                                    Priority
                                </th>
                                <th className="bg-gray-100 p-4 text-heading text-center font-semibold last:rounded-te-md">
                                    Action
                                </th>
                            </tr>
                            </thead>
                            <tbody className="text-sm lg:text-base ">
                            {
                                todos ? (
                                    todos.map((todo) => (
                                        <tr key={todo?._id} className="border-b border-gray-300 last:border-b-0">
                                            <td className=" px-4 py-5 flex text-start hover:no-underline text-body">
                                                <CheckBox onChange={()=>handleUpdateTodo(todo)} />
                                                {todo?.title}
                                            </td>
                                            <td className="px-4 py-5 text-body">
                                                {todo?.description}
                                            </td>
                                            <td className="px-4 py-5 text-center  hover:no-underline text-body">
                                                {todo?.priority}
                                            </td>
                                            <td className="px-4 py-5 text-center  hover:no-underline text-body">
                                                <button className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={async () => {
                                                            await setFormData(todo);
                                                            await setTaskModal(true);
                                                        }
                                                        }
                                                >
                                                    <BiEdit/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : ""
                            }
                            </tbody>
                        </table>
                    )
                }

            </motion.div>
        </Fragment>
    );
};

export default TodoList;