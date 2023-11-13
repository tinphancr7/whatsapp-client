"use client";
import React, {useState, useEffect} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Image from "next/image";
import {useRouter} from "next/navigation";
import {loginRoute} from "@/utils/APIRoutes";
import Link from "next/link";
import {useAuthentication} from "@/contexts/app.context";
import {setProfileToLS} from "@/utils/auth";

export default function Login() {
	const router = useRouter();
	const [values, setValues] = useState({username: "", password: ""});
	const {setUserInfo} = useAuthentication();

	useEffect(() => {
		if (localStorage.getItem("userInfo")) {
			router.push("/");
		}
	}, []);

	const handleChange = (event) => {
		setValues({...values, [event.target.name]: event.target.value});
	};

	const validateForm = () => {
		const {username, password} = values;
		if (username === "") {
			toast.error("Email and Password is required.");
			return false;
		} else if (password === "") {
			toast.error("Email and Password is required.");
			return false;
		}
		return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (validateForm()) {
			const {username, password} = values;
			const {data} = await axios.post(loginRoute, {
				username,
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
		}
	};

	return (
		<div className="w-full h-full flex flex-col justify-center gap-4 items-center bg-[#131324] ">
			<form
				action=""
				onSubmit={(event) => handleSubmit(event)}
				className="flex flex-col gap-8 bg-[#00000076] rounded-lg p-20"
			>
				<div className="flex items-center gap-4 justify-center ">
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
					min="3"
					className="bg-transparent p-4 border border-[#4e0eff] rounded-lg text-white focus:border-[#997af0] focus:outline-none"
				/>
				<input
					type="password"
					placeholder="Password"
					name="password"
					onChange={(e) => handleChange(e)}
					className="bg-transparent p-4 border border-[#4e0eff] rounded-lg text-white focus:border-[#997af0] focus:outline-none"
				/>
				<button
					className="bg-[#4e0eff] text-white px-8 py-4 rounded-md border-none font-bold uppercase hover:bg-[#4e0eff] transition-all"
					type="submit"
				>
					Log In
				</button>
				<span className="text-white uppercase">
					Don't have an account ?{" "}
					<Link className="text-[#4e0eff] font-bold" href="/register">
						Create One.
					</Link>
				</span>
			</form>
		</div>
	);
}
