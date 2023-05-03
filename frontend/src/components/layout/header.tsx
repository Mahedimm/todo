import React from "react";
import {useRouter} from "next/router";
import {userInfo} from "@utils/auth";
import {useLogOutMutation} from "@redux/services/auth/api";
import Link from "@components/ui/link";
import {IoMdLogOut} from "react-icons/io";

const Header = () => {

    const user = userInfo()
    const [logOut] = useLogOutMutation()
    return (
        <div className="w-full h-full flex flex-col justify-between">
            <header
                className="h-16 w-full flex items-center relative justify-end px-5 space-x-10 bg-black">
                <div className="flex flex-shrink-0 items-center space-x-4 text-white">
                    {
                        user && user._id && user._id !== "" ? (
                            <div className="flex items-center justify-start  ">
                                <div className="text-2xl  font-bold ">{user.firstName} {user.lastName}</div>
                                <Link href="/"><a onClick={() => logOut({ action: () => null })}><IoMdLogOut className="h-10 w-10 text-red-600"/></a></Link>
                                {/*<div className="text-sm font-regular"></div>*/}
                            </div>
                        ):(
                            <Link href="/auth/signin">
                                <a>Sign In</a>
                            </Link>
                        )
                    }
                </div>
            </header>
        </div>
    );
};

export default Header;