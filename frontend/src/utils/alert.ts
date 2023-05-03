import Swal from "sweetalert2";
import toast from 'react-hot-toast';

interface alert {
    title?: string,
    icon?: any,
    timer?: number,
    position?: any,
    showConfirmButton?: boolean,
}

interface confirm {
    title?: string,
    text?: string,
    icon?: any,
    showCancelButton?: boolean,
    confirmButtonText?: string
}

interface callback {
    (message: string): void;
}

export const successAlert = (props: alert): void => {
    toast.success(props.title ? props.title : "Warning!", {
        duration: props.timer ? props.timer : 3000,
        position: props.position ? props.position : 'bottom-left',
    })
}

export const warningAlert = (props: alert): void => {
    toast(props.title ? props.title : "Warning!", {
        duration: props.timer ? props.timer : 3000,
        position: props.position ? props.position : 'bottom-left',
    })
}

export const errorAlert = (props: alert): void => {
    toast.error(props.title ? props.title : "Something Went Wrong!", {
        duration: props.timer ? props.timer : 3000,
        position: props.position ? props.position : 'bottom-left',
    })
}

export const infoAlert = (props: alert, callback: callback): void => {
    toast(props.title ? props.title : "Warning!", {
        duration: props.timer ? props.timer : 3000,
        position: props.position ? props.position : 'bottom-left',
    })
}

export const confirmAlert = (props: confirm, callback: callback): void => {
    Swal.fire({
        title: props.title,
        text: props.text,
        icon: props.icon,
        showCancelButton: !!props.showCancelButton,
        confirmButtonText: props.confirmButtonText ? props.confirmButtonText : "Yes, do it!",
        confirmButtonColor: "#fd6f0f"
    }).then((result) => {
        if (result.value) callback(result.value)
    })
}
