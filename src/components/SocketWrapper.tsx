"use client";
import React from "react";
import {useEffect, useRef} from "react";
import {useAuthentication} from "@/contexts/app.context";
import io from "socket.io-client";
import {host} from "@/utils/APIRoutes";
import ChatList from "./Chatlist/ChatList";

const SocketWrapper = ({children}: any) => {
	const {userInfo, setSocket, onlineUsers, setOnlineUsers} =
		useAuthentication();

	const socket = useRef<any>();
	useEffect(() => {
		if (userInfo) {
			socket.current = io(host);
			socket.current.emit("add-user", userInfo?._id);
			socket.current.on("online-users", (users: any) => {
				setOnlineUsers(users || []);
			});
			setSocket(socket);
		}
	}, [userInfo?._id]);
	return (
		<div className="grid grid-cols-main h-screen w-screen max-h-screen overflow-hidden">
			<ChatList />
			{children}
		</div>
	);
};

export default SocketWrapper;
