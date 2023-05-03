import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import Button from "@components/ui/button";
// import Logo from "@components/ui/logo";
import { ImGoogle2, ImFacebook2 } from "react-icons/im";
import Link from "@components/ui/link";
import React, { FormEvent, useEffect, useState } from "react";
import { Constants } from "@utils/constants";
import { useSignUpMutation } from "@redux/services/auth/api";
import Router from "next/router";
const SignUpForm: React.FC = () => {
	const initialFormData = {
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		gender: "",
		password: "",
	}

	const [signUp, {data, error, isError, isLoading}] = useSignUpMutation();
	const [formData, setFormData] = useState(initialFormData)
	const [errors, setErrors] = useState(initialFormData)

	const onSubmit = (event: FormEvent) => {
		event.preventDefault();
		signUp(formData);

	}

	if (!isError && data) {
		setTimeout(() => {
			Router.push("/");
		}, 500)
	}

	return (
		<div className="py-5 px-5 sm:px-8 bg-white mx-auto rounded-lg w-full sm:w-96 md:w-450px border border-gray-300">
			<div className="text-center mb-6 pt-2.5">
				<div onClick={() => console.log("clicked")}>
					{/* <Logo /> */}
				</div>
			</div>
			<form
				onSubmit={onSubmit}
				className="flex flex-col justify-center"
			>
				<div className="flex flex-col space-y-4">
					<h5 className="text-sm font-semibold text-black">First Name</h5>
					<Input
						name="firstName"
						value={formData.firstName}
						onChange={({ target }) => setFormData({ ...formData, firstName: target.value })}
						className="relative w-full"
						placeholderKey="First Name"
						required={true}
						errorKey={errors.firstName}
						variant="solid"
					/>
					<h5 className="text-sm font-semibold text-black">Last Name</h5>
					<Input
						name="lastName"
						value={formData.lastName}
						onChange={({ target }) => setFormData({ ...formData, lastName: target.value })}
						className="relative w-full"
						placeholderKey="Last Name"
						required={true}
						errorKey={errors.lastName}
						variant="solid"
					/>
					<h5 className="text-sm font-semibold text-black">Email</h5>
					<Input
						type="email"
						name="email"
						value={formData.email}
						onChange={({ target }) => setFormData({ ...formData, email: target.value })}
						className="relative w-full"
						placeholderKey="Email"
						required={true}
						errorKey={errors.email}
						variant="solid"
					/>
					<h5 className="text-sm font-semibold text-black">Phone</h5>
					<div className="flex">
						<Input
							type="number"
							name="phone"
							value={formData.phone}
							onChange={({ target }) => setFormData({ ...formData, phone: target.value })}
							className="w-full"
							inputClassName="rounded-l-none"
							placeholderKey="Phone"
							required={true}
							variant="solid"
							onWheel={event => event.currentTarget.blur()}
						/>
					</div>
					<h5 className="text-sm font-semibold text-black">Gender</h5>
					<div className="w-full z-20">
						<select
							name="gender"
							required={true}
							value={formData.gender}
							onChange={({ target }) => setFormData({ ...formData, gender: target.value })}
							className="py-2 px-4 md:px-5 w-full flex items-center justify-center h-12 bg-blue-lighter border border-gray-300 rounded text-blue-dark"
						>
							<option value="">Select One</option>
							{Constants.GENDERS.map((gender, gi) => (<option key={gi} value={gender.value}>{gender.label}</option>))}
						</select>
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
						{isLoading
							? <Button
								type="submit"
								className="h-11 md:h-12 w-full mt-2 disabled:opacity-75"
								disabled
							>
								Loading...
							</Button>
							: <Button
								type="submit"
								className="h-11 md:h-12 w-full mt-2 bg-black"
							>
								Register
							</Button>
						}
					</div>
				</div>
			</form>
			<div className="text-sm sm:text-base text-body text-center mt-5 mb-1">
				Already have an account?{" "}
				<button
					type="button"
					className="text-sm sm:text-base text-heading underline font-bold hover:no-underline focus:outline-none"
				>
					<Link href="/auth/signin">Login</Link>
				</button>
			</div>
		</div>
	);
};

export default SignUpForm;
