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
			<div className="relative">
				<Image
					src={`${host}/${message.message}`}
					className="rounded-lg"
					alt="asset"
					height={300}
					width={300}
				/>
				<div className="absolute bottom-1 right-1 flex items-end gap-1">
					<span className="text-bubble-meta text-xs pt-1 min-w-fit">
						{calculateTime(message?.createdAt)}
					</span>
					<span>
						{message?.sender === userInfo?._id && (
							<MessageStatus status={message.MessageStatus} />
						)}
					</span>
				</div>
			</div>
		</div>
	);
}

export default ImageMessage;
