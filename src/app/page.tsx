"use client";

import {useAuthentication} from "@/contexts/app.context";
import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";

import Empty from "@/components/Empty";

import SocketWrapper from "@/components/SocketWrapper";

function Main() {
	const router = useRouter();
	const {userInfo} = useAuthentication();

	useEffect(() => {
		if (!userInfo) {
			router.push("/login");
		} else {
			if (!userInfo.isAvatarImageSet) {
				router.push("/setAvatar");
			}
		}
	}, [userInfo, router]);

	const [socketEvent, setSocketEvent] = useState(false);

	return (
		<SocketWrapper>
			<Empty userInfo={userInfo} />
		</SocketWrapper>
	);
}
export default Main;
