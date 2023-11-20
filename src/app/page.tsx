"use client";

import {useAuthentication} from "@/contexts/app.context";
import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import Empty from "@/components/Empty";
import IncomingCall from "@/components/common/IncomingCall";
import IncomingVideoCall from "@/components/common/IncomingVideoCall";
import VideoCall from "@/components/Call/VideoCall";
import VoiceCall from "@/components/Call/VoiceCall";
import SearchMessages from "@/components/Chat/SearchMessages";
import ChatList from "@/components/Chatlist/ChatList";
import io from "socket.io-client";
import {GET_MESSAGES_ROUTE, host} from "@/utils/APIRoutes";
import axios from "axios";
import Chat from "@/components/Chat/Chat";
function Main() {
	const router = useRouter();
	const {
		userInfo,
		onlineUsers,
		currentChatUser,
		setNotifications,
		setOnlineUsers,
		setSocket,
		setMessages,
		messages,
		messageSearch,
		setMessageSearch,
		incomingVoiceCall,
		setIncomingVoiceCall,
		voiceCall,
		setVoiceCall,
		incomingVideoCall,
		setIncomingVideoCall,
		videoCall,
		setVideoCall,
	} = useAuthentication();

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

	useEffect(() => {
		if (socket?.current && !socketEvent) {
			socket?.current.on("msg-receive", (data: any) => {
				setMessages((prev: any) => [...prev, data.message]);
			});
			socket?.current.on("get-notification", (data: any) => {
				const isChatOpen = currentChatUser?._id === data.from._id;
				if (isChatOpen) {
					setNotifications((prev: any) => [
						...prev,
						{
							...data,
							isRead: true,
						},
					]);
				} else {
					setNotifications((prev: any) => [...prev, data]);
				}
			});
			socket.current.on(
				"incoming-video-call",
				({from, roomId, callType}: any) => {
					setIncomingVideoCall({
						...from,
						roomId,
						callType,
					});
				}
			);
			socket.current.on(
				"incoming-voice-call",
				({from, roomId, callType}: any) => {
					console.log("from", from, roomId, callType);
					setIncomingVoiceCall({
						...from,
						roomId,
						callType,
					});
				}
			);
			socket.current.on("voice-call-rejected", () => {
				setVoiceCall(null);
				setIncomingVoiceCall(null);
			});
			socket.current.on("video-call-rejected", () => {
				setVideoCall(null);
				setIncomingVideoCall(null);
			});
			socket.current.on("accept-incoming-call", () => {
				setVideoCall(null);
				setIncomingVideoCall(null);
				setVoiceCall(null);
				setIncomingVoiceCall(null);
			});
			setSocketEvent(true);
		}
	}, [socket?.current, socketEvent]);
	useEffect(() => {
		const getMessages = async () => {
			const {
				data: {messages},
			} = await axios.get(
				`${GET_MESSAGES_ROUTE}/${userInfo?._id}/${currentChatUser?._id}`
			);

			setMessages(messages);
		};
		if (currentChatUser?._id) {
			getMessages();
		}
	}, [currentChatUser?._id, userInfo?._id]);

	return (
		<div>
			{incomingVoiceCall && (
				<IncomingCall
					setVoiceCall={setVoiceCall}
					incomingVoiceCall={incomingVoiceCall}
					setIncomingVoiceCall={setIncomingVoiceCall}
				/>
			)}
			{incomingVideoCall && (
				<IncomingVideoCall
					videoCall={videoCall}
					setVideoCall={setVideoCall}
					incomingVideoCall={incomingVideoCall}
					setIncomingVideoCall={setIncomingVideoCall}
				/>
			)}
			{videoCall && (
				<div className="h-screen w-screen max-h-full overflow-hidden">
					<VideoCall
						videoCall={videoCall}
						setVideoCall={setVideoCall}
						userInfo={userInfo}
						socket={socket}
					/>
				</div>
			)}
			{voiceCall && (
				<div className="h-screen w-screen max-h-full overflow-hidden">
					<VoiceCall
						voiceCall={voiceCall}
						setVoiceCall={setVoiceCall}
						userInfo={userInfo}
						socket={socket}
					/>
				</div>
			)}
			{!voiceCall && !videoCall && (
				<div className="grid grid-cols-main h-screen w-screen max-h-screen overflow-hidden">
					<ChatList />
					{currentChatUser ? (
						<div className={messageSearch ? "grid grid-cols-2" : "grid-cols-2"}>
							<Chat />
							{messageSearch && (
								<SearchMessages
									messages={messages}
									currentChatUser={currentChatUser}
									messageSearch={messageSearch}
									setMessageSearch={setMessageSearch}
								/>
							)}
						</div>
					) : (
						<Empty userInfo={userInfo} />
					)}
				</div>
			)}
		</div>
	);
}
export default Main;
