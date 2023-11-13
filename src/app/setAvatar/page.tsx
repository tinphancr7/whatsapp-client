"use client";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Buffer} from "buffer";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {setAvatarRoute} from "@/utils/APIRoutes";
import {useAuthentication} from "@/contexts/app.context";
import {setProfileToLS} from "@/utils/auth";
export default function SetAvatar() {
	const api = `https://api.multiavatar.com/4645646`;
	const router = useRouter();
	const [avatars, setAvatars] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedAvatar, setSelectedAvatar] = useState<number | undefined>(
		undefined
	);
	const {userInfo} = useAuthentication();

	useEffect(() => {
		if (!userInfo) router.push("/login");
	}, []);

	const setProfilePicture = async () => {
		if (selectedAvatar === undefined) {
			toast.error("Please select an avatar");
		} else {
			const {data} = await axios.post(`${setAvatarRoute}/${userInfo._id}`, {
				image: avatars[selectedAvatar],
			});

			if (data.isSet) {
				userInfo.isAvatarImageSet = true;
				userInfo.avatarImage = data.image;
				setProfileToLS(userInfo);
				router.push("/");
			} else {
				toast.error("Error setting avatar. Please try again.");
			}
		}
	};

	useEffect(() => {
		const getAvatar = async () => {
			const data = [];
			for (let i = 0; i < 4; i++) {
				const image = await axios.get(
					`${api}/${Math.round(Math.random() * 1000)}`
				);
				const buffer = new Buffer(image.data);
				data.push(buffer.toString("base64"));
			}
			setAvatars(data as any);
			setIsLoading(false);
		};
		getAvatar();
	}, []);
	return (
		<>
			{isLoading ? (
				<div className="flex items-center justify-center flex-col gap-10 bg-[#131324] h-[100vh] w-[100vw]">
					<div className="relative w-[500px] h-[500px]">
						<Image
							src="/images/loader.gif"
							alt="loader"
							fill
							className="object-cover"
						/>
					</div>
				</div>
			) : (
				<div className="flex items-center justify-center flex-col gap-10 bg-[#131324] h-[100vh] w-[100vw]">
					<div className="">
						<h1 className="text-white text-3xl">
							Pick an Avatar as your profile picture
						</h1>
					</div>
					<div className="flex gap-8">
						{avatars.map((avatar, index: number) => {
							return (
								<div
									key={avatar}
									className={`flex items-center relative w-[100px] h-[100px] justify-center transition-all cursor-pointer rounded-full ${
										selectedAvatar === index ? "border-2 border-[#4e0eff] " : ""
									}`}
								>
									<Image
										src={`data:image/svg+xml;base64,${avatar}`}
										alt="avatar"
										onClick={() => setSelectedAvatar(index)}
										fill
										className="object-cover rounded-full p-2"
									/>
								</div>
							);
						})}
					</div>
					<button
						onClick={setProfilePicture}
						className="bg-[#4e0eff] text-white px-8 py-2 border-none font-bold cursor-pointer rounded uppercase hover:bg-[#4e0eff] transition-all"
					>
						Set as Profile Picture
					</button>
				</div>
			)}
		</>
	);
}
