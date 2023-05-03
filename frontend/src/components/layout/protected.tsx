import React, {FC, ReactNode, useEffect, useState, Fragment} from "react"
import { useRouter } from "next/router"
import {Constants} from "@utils/constants";

const Protected: FC<{children: ReactNode}> = ({children}) => {
    const Router = useRouter()
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem(Constants.ACCESS_TOKEN);
        if (!accessToken) {
            Router.replace("/auth/signin");
        } else {
            setVerified(true);
        }
    }, []);

    if (verified) {
        return (<Fragment>{children}</Fragment>)
    } else {
        return null;
    }
}

export default Protected;