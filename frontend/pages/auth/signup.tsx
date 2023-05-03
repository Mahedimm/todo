import SignUpForm from "@containers/auth/registerForm";

const  signupPage: () => JSX.Element = () => {
    return (
        <div className="flex flex-row min-h-screen justify-center items-center">
            <SignUpForm />
        </div>
    )
}

export default signupPage