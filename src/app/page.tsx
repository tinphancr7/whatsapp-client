"use client";
import {io} from "socket.io-client";
import {useAuthentication} from "@/contexts/app.context";
import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {GET_MESSAGES_ROUTE, host} from "@/utils/APIRoutes";
import Empty from "@/components/Empty";

import axios from "axios";

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
		<>
			<Empty userInfo={userInfo} />
		</>
	);
}
export default Main;
