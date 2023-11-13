"use client";
import React, {useState, useEffect} from "react";
import axios from "axios";

import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {registerRoute} from "@/utils/APIRoutes";
import {setAccessTokenToLS, setProfileToLS} from "@/utils/auth";
import {useAuthentication} from "@/contexts/app.context";

export default function Register() {
	const router = useRouter();
	const {setUserInfo} = useAuthentication();

	const [values, setValues] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	useEffect(() => {
		if (localStorage.getItem("userInfo")) {
			router.push("/");
		}
	}, []);

	const handleChange = (event) => {
		setValues({...values, [event.target.name]: event.target.value});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const {email, username, password} = values;
		const {data} = await axios.post(registerRoute, {
			username,
			email,
			password,
		});

		if (data.status === false) {
			toast.error(data.msg);
		}
		if (data.status === true) {
			setUserInfo(data.user);
			setProfileToLS(data.user);
			router.push("/");
		}
	};

	return (
		<>
			<div className="w-full h-full flex flex-col justify-center gap-4 items-center bg-[#131324] ">
				<form
					action=""
					onSubmit={(event) => handleSubmit(event)}
					className="flex flex-col gap-8 bg-[#00000076] rounded-lg p-20"
				>
					<div className="flex items-center justify-center gap-4">
						<div className="relative h-20 w-20">
							<Image
								src="/images/logo.svg"
								fill
								className="object-cover"
								alt=""
							/>
						</div>
						<h1 className="text-white uppercase text-2xl">snappy</h1>
					</div>
					<input
						type="text"
						placeholder="Username"
						name="username"
						onChange={(e) => handleChange(e)}
						className="bg-transparent p-4 border border-[#4e0eff] rounded-lg text-white focus:border-[#997af0] focus:outline-none"
					/>
					<input
						type="email"
						placeholder="Email"
						name="email"
						onChange={(e) => handleChange(e)}
						className="bg-transparent p-4 border border-[#4e0eff] rounded-lg text-white focus:border-[#997af0] focus:outline-none"
					/>
					<input
						type="password"
						placeholder="Password"
						name="password"
						onChange={(e) => handleChange(e)}
						className="bg-transparent p-4 border border-[#4e0eff] rounded-lg text-white focus:border-[#997af0] focus:outline-none"
					/>
					<input
						type="password"
						placeholder="Confirm Password"
						name="confirmPassword"
						onChange={(e) => handleChange(e)}
						className="bg-transparent p-4 border border-[#4e0eff] rounded-lg text-white focus:border-[#997af0] focus:outline-none"
					/>
					<button
						className="bg-[#4e0eff] text-white px-8 py-4 rounded-md border-none font-bold uppercase hover:bg-[#4e0eff] transition-all"
						type="submit"
					>
						Create User
					</button>
					<span className="text-white uppercase">
						Already have an account ?{" "}
						<Link className="text-[#4e0eff] font-bold" href="/login">
							Login.
						</Link>
					</span>
				</form>
			</div>
		</>
	);
}
