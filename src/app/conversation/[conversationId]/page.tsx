"use client";
import VideoCall from "@/components/Call/VideoCall";
import VoiceCall from "@/components/Call/VoiceCall";
import ChatContainer from "@/components/Chat/ChatContainer";
import ChatHeader from "@/components/Chat/ChatHeader";
import MessageBar from "@/components/Chat/MessageBar";
import SearchMessages from "@/components/Chat/SearchMessages";
import Empty from "@/components/Empty";
import SocketWrapper from "@/components/SocketWrapper";
import IncomingCall from "@/components/common/IncomingCall";
import IncomingVideoCall from "@/components/common/IncomingVideoCall";
import {useAuthentication} from "@/contexts/app.context";
import {GET_MESSAGES_ROUTE, GET_USER_ROUTE} from "@/utils/APIRoutes";
import {unReadNotificationsFunc} from "@/utils/unReadNotifications";
import axios from "axios";
import {useState, useEffect} from "react";

function Chat({params}: {params: any}) {
	const {
		userInfo,
		socket,
		onlineUsers,
		currentChatUser,
		setCurrentChatUser,
		setNotifications,
	} = useAuthentication();
	const [messages, setMessages] = useState<any>([]);

	const [socketEvent, setSocketEvent] = useState(false);
	const [messageSearch, setMessageSearch] = useState(false);
	const [incomingVoiceCall, setIncomingVoiceCall] = useState<any>(null);
	const [voiceCall, setVoiceCall] = useState<any>(null);
	const [incomingVideoCall, setIncomingVideoCall] = useState<any>(null);
	const [videoCall, setVideoCall] = useState<any>(null);

	useEffect(() => {
		const getOtherUser = async () => {
			const data = await axios.get(
				`${GET_USER_ROUTE}/${params.conversationId}`
			);
			setCurrentChatUser(data.data?.user || {});
		};

		getOtherUser();
	}, [params.conversationId]);
	useEffect(() => {
		if (socket?.current && !socketEvent) {
			socket?.current.on("msg-receive", (data: any) => {
				console.log("data", data);
				setMessages((prev: any) => [...prev, data.message]);
			});
			socket?.current.on("get-notification", (data: any) => {
				console.log("data1", data);
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
		<SocketWrapper>
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
					<VideoCall videoCall={videoCall} setVideoCall={setVideoCall} />
				</div>
			)}
			{voiceCall && (
				<div className="h-screen w-screen max-h-full overflow-hidden">
					<VoiceCall voiceCall={voiceCall} setVoiceCall={setVoiceCall} />
				</div>
			)}
			{!voiceCall && !videoCall && currentChatUser ? (
				<div className={messageSearch ? "grid grid-cols-2" : "grid-cols-2"}>
					<div className="border-conversation-border  border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] z-10">
						{currentChatUser && (
							<>
								<ChatHeader
									onlineUsers={onlineUsers}
									currentChatUser={currentChatUser}
									setVoiceCall={setVoiceCall}
									setVideoCall={setVideoCall}
									setMessageSearch={setMessageSearch}
								/>
								<ChatContainer
									messages={messages}
									currentChatUser={currentChatUser}
								/>
								<MessageBar
									setMessages={setMessages}
									currentChatUser={currentChatUser}
									userInfo={userInfo}
									socket={socket}
								/>
							</>
						)}
					</div>
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
		</SocketWrapper>
	);
}

export default Chat;
