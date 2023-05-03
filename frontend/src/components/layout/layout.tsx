import React, { FC, Fragment, useEffect, useState } from "react";
import { useLogOutMutation, useRenewMutation } from "@redux/services/auth/api";
import { Constants } from "@utils/constants";
import Preloader from "@components/ui/preloader";
import Header from "@components/layout/header";
import Aside from "@components/layout/aside";
const Layout: FC = ({ children }) => {
    const [loader, setLoader] = useState(false)
    const [render, setRender] = useState(false)

    const [logOut] = useLogOutMutation();
    const [renew] = useRenewMutation();


    useEffect(() => validateAuth(), [])

    const validateAuth = () => {
        const access = localStorage.getItem(Constants.ACCESS_TOKEN)
        const refresh = localStorage.getItem(Constants.REFRESH_TOKEN)

        if (access && refresh) {
            const accessToken: { expires: string, token: string } = JSON.parse(access)
            const refreshToken: { expires: string, token: string } = JSON.parse(refresh)

            if (new Date(accessToken.expires) < new Date()) {
                if (new Date(refreshToken.expires) < new Date()) {
                    logOut({ action: () => setRender(true) })
                } else {
                    setLoader(true)
                    renew({
                        body: { access: accessToken.token, refresh: refreshToken.token },
                        logout: () => logOut({ action: () => setRender(true) }),
                        render: () => setRender(true)
                    })
                }
            } else setRender(true)
        } else setRender(true)
    }


    return (
        <div className="flex flex-col min-h-screen">
            {render ? (
                <Fragment>
                    <Preloader loading={loader} />
                        <Header />
                    <main
                        className="relative flex-grow"
                        style={{
                            minHeight: "-webkit-fill-available",
                            WebkitOverflowScrolling: "touch",
                        }}
                    >
                        {children}
                    </main>
                    {/*<Footer />*/}
                </Fragment>
            ) : 'Loading...'}
        </div>
    );
};

export default Layout;