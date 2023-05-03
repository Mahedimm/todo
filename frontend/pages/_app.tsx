import React, { Fragment } from "react";
import {AppProps} from "next/app";
import "@styles/global.css";
import {Provider} from "react-redux";
import store from "@redux/store";
import { Toaster } from 'react-hot-toast';
import Layout from "@components/layout/layout";

function MyApp({Component, pageProps}: AppProps): JSX.Element {
    return (
        <Fragment>
             <Provider store={store}>
                <Layout>
                    {/*@ts-ignore*/}
                    <Component {...pageProps} />
                </Layout>
            </Provider>
        </Fragment>
    );
}

export default MyApp;
