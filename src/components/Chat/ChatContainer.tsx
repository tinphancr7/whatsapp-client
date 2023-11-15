import {calculateTime} from "@/utils/CalculateTime";
import React from "react";
import ImageMessage from "./ImageMessage";
import VoiceMessage from "./VoiceMessage";
import MessageStatus from "../common/MessageStatus";
import {useAuthentication} from "@/contexts/app.context";
interface ChatContainerProps {
	messages: any;
	currentChatUser: any;
}
function ChatContainer({messages, currentChatUser}: ChatContainerProps) {
	const {userInfo} = useAuthentication();

	return (
		<div className="h-[80vh] w-ful  relative flex-grow overflow-auto custom-scrollbar">
			<div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
			<div className="mx-10 my-6 relative bottom-0 z-40 left-0">
				<div className="flex w-full">
					<div className="flex flex-col justify-end w-full gap-1 overflow-auto">
						{messages?.map((message: any, index: number) => (
							<div
								key={index}
								className={`flex ${
									message?.sender === currentChatUser?._id
										? "justify-start"
										: "justify-end"
								}`}
							>
								{message?.type === "text" && (
									<div
										className={`
              text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%]
              ${
								message?.sender === currentChatUser?._id
									? "bg-incoming-background"
									: "bg-outgoing-background"
							}`}
									>
										<span className="break-all">{message?.message}</span>
										<div className="flex gap-1 items-end">
											<span className="text-bubble-meta text-xs pt-1 min-w-fit">
												{calculateTime(message?.createdAt)}
											</span>
											<span>
												{message?.sender === userInfo._id && (
													<MessageStatus
														messageStatus={message.messageStatus}
													/>
												)}
											</span>
										</div>
									</div>
								)}
								{message.type === "image" && (
									<ImageMessage
										message={message}
										currentChatUser={currentChatUser}
									/>
								)}
								{message.type === "audio" && (
									<VoiceMessage
										message={message}
										currentChatUser={currentChatUser}
									/>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ChatContainer;
