import React, { FC, FormEvent, useEffect, useState } from "react";
import Input from "@components/ui/input";
import Button from "@components/ui/button";
import { useSignInMutation,} from "@redux/services/auth/api";
import Router, {useRouter} from "next/router";
import PasswordInput from "@components/ui/password-input";
import Link from "next/link";

const LoginForm: FC<{ action?: () => void }> = (props) => {
	const [signIn, signInParams] = useSignInMutation();
	const initialFormData = {password: "", email: ""}
	const [formData, setFormData] = useState(initialFormData)
	const [errors, setErrors] = useState(initialFormData)

	const router = useRouter();

	useEffect(() => {
		// @ts-ignore
		if (signInParams?.error?.data?.stack) setErrors(signInParams?.error?.data?.stack)
	}, [signInParams.error])

	const onSubmit = (event: FormEvent) => {
		event.preventDefault();
		signIn(formData);
	}

	if (!signInParams?.isError && signInParams?.data) {
		setTimeout(() => {
			Router.push("/");
		}, 500)
	}

	return (
		<div className="overflow-hidden bg-white  rounded-lg  sm:w-96 md:w-450px border border-gray-300 py-5 px-5 sm:px-8">
			<div className="text-center mb-6 pt-2.5">
				<p className="text-sm md:text-base text-body mt-2 mb-8 sm:mb-10">
				 	<span>Login with your Email</span>
				</p>
			</div>
			<form
				onSubmit={onSubmit}
				className="flex flex-col justify-center"
			>
				<div className="flex flex-col space-y-3.5">
					<h5 className="text-sm font-semibold text-black">Email</h5>
					<div className="flex">
						<Input
							type="email"
							name="email"
							value={formData.email}
							onChange={({ target }) => setFormData({ ...formData, email: target.value })}
							className="w-full"
							placeholderKey="Email"
							required={true}
							variant="solid"
							onWheel={event => event.currentTarget.blur()}
						/>
					</div>
					<PasswordInput
						className=""
						labelKey="password"
					    name="password"
					    errorKey={errors.password}
						value={formData.password}
						onChange={({ target }) => setFormData({ ...formData, password: target.value })}
					/>
					<div className="relative">
						{signInParams.isLoading
							? <Button
								type="submit"
								className="h-11 md:h-12 w-full mt-1.5 disabled:opacity-75"
								disabled
							>
								Loading...
							</Button>
							: <Button
								type="submit"
								className="h-11 md:h-12 bg-black w-full mt-1.5"
							>
								Login
							</Button>
						}
					</div>
				</div>
			</form>
			<div className="flex flex-col items-center justify-center relative text-sm text-heading mt-6 mb-3.5">
				<hr className="w-full border-gray-300" />
				<span className="absolute -top-2.5 px-2 bg-white">
					Or
				</span>
			</div>
			<div className="relative">
			</div>
			<div className="text-sm sm:text-base text-body text-center mt-5 mb-1">
				Don't have any account?{" "}
				<button
					type="button"
					className="text-sm sm:text-base text-heading underline font-bold hover:no-underline focus:outline-none"
				>
					<Link href="/auth/signup">
						Register
					</Link>
				</button>
			</div>
		</div>
	);
};

export default LoginForm;
