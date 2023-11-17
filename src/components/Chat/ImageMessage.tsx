import {calculateTime} from "@/utils/CalculateTime";
import Image from "next/image";
import React from "react";
import MessageStatus from "../common/MessageStatus";
import {useAuthentication} from "@/contexts/app.context";
import {host} from "@/utils/APIRoutes";

function ImageMessage({message, currentChatUser}: any) {
	const {userInfo} = useAuthentication();
	return (
		<div
			className={`p-1 rounded-lg ${
				message.sender === currentChatUser._id
					? "bg-incoming-background"
					: "bg-outgoing-background"
			}`}
		>
			<div className="relative w-[300px] h-[200px]">
				<Image
					src={`${host}/${message.message}`}
					className="rounded-lg object-container"
					alt="asset"
					fill
				/>
			</div>
			<div className=" flex items-center jus gap-1">
				<span className="text-bubble-meta text-xs pt-1 min-w-fit">
					{calculateTime(message?.createdAt)}
				</span>
				<span className="text-bubble-meta">
					{message?.sender === userInfo?._id && (
						<MessageStatus messageStatus={message.messageStatus} />
					)}
				</span>
			</div>
		</div>
	);
}

export default ImageMessage;
