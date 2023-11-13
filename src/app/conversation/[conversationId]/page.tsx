"use client";
import ChatContainer from "@/components/Chat/ChatContainer";
import ChatHeader from "@/components/Chat/ChatHeader";
import MessageBar from "@/components/Chat/MessageBar";
import Empty from "@/components/Empty";
import {useAuthentication} from "@/contexts/app.context";
import {GET_MESSAGES_ROUTE, GET_USER_ROUTE} from "@/utils/APIRoutes";
import axios from "axios";
import {useState, useEffect} from "react";

function Chat({params}: {params: any}) {
	const {userInfo, socket} = useAuthentication();
	const [messages, setMessages] = useState([]);
	const [currentChatUser, setCurrentChatUser] = useState({});
	const [socketEvent, setSocketEvent] = useState(false);

	useEffect(() => {
		const getOtherUser = async () => {
			const data = await axios.get(
				`${GET_USER_ROUTE}/${params.conversationId}`
			);

			setCurrentChatUser(data.data?.user);
		};

		getOtherUser();
	}, [params.conversationId]);
	useEffect(() => {
		if (socket?.current && !socketEvent) {
			socket?.current.on("msg-receive", (data: any) => {
				setMessages((prev: any) => [...prev, data.message]);
			});
			// socket.current.on("incoming-video-call", ({from, roomId, callType}) => {
			// 	dispatch({
			// 		type: reducerCases.SET_INCOMING_VIDEO_CALL,
			// 		incomingVideoCall: {
			// 			...from,
			// 			roomId,
			// 			callType,
			// 		},
			// 	});
			// });
			// socket.current.on("incoming-voice-call", ({from, roomId, callType}) => {
			// 	dispatch({
			// 		type: reducerCases.SET_INCOMING_VOICE_CALL,
			// 		incomingVoiceCall: {
			// 			...from,
			// 			roomId,
			// 			callType,
			// 		},
			// 	});
			// });
			// socket.current.on("voice-call-rejected", () => {
			// 	dispatch({
			// 		type: reducerCases.END_CALL,
			// 	});
			// });
			// socket.current.on("video-call-rejected", () => {
			// 	dispatch({
			// 		type: reducerCases.END_CALL,
			// 	});
			// });
			// socket.current.on("accept-incoming-call", () => {
			// 	dispatch({
			// 		type: reducerCases.END_CALL,
			// 	});
			// });
			setSocketEvent(true);
		}
	}, [socket?.current]);
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
		<>
			{currentChatUser ? (
				<div className={"grid-cols-2"}>
					<div className="border-conversation-border  border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] z-10">
						{currentChatUser && (
							<>
								<ChatHeader currentChatUser={currentChatUser} />
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
					{/* {messageSearch && <SearchMessages />} */}
				</div>
			) : (
				<Empty userInfo={userInfo} />
			)}
		</>
	);
}

export default Chat;
