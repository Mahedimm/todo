import React, {FC, Fragment} from "react";
import BarLoader from "react-spinners/BarLoader";

const Preloader: FC<{loading: boolean}> = ({loading}) => {
    return (
        <Fragment>
            {/* @ts-ignore */}
            <BarLoader css={{position: 'fixed', background: '#fff', zIndex: '9999'}}
                height={3}
                width={'100%'}
                color={'#333'}
                loading={loading}
            />
        </Fragment>
    )
}

export default Preloader;
