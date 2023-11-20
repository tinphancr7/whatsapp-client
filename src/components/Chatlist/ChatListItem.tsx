import React from "react";
import Avatar from "../common/Avatar";
import {useAuthentication} from "@/contexts/app.context";
import Image from "next/image";
import Link from "next/link";
import {calculateTime} from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import {FaCamera, FaMicrophone} from "react-icons/fa";
import {unReadNotificationsFunc} from "@/utils/unReadNotifications";

function ChatListItem({data, userInfo}: any) {
	const {notifications, pageType, onlineUsers} = useAuthentication();
	console.log("notifications", notifications);
	const unreadNotifications = unReadNotificationsFunc(notifications);
	const totalUnreadNotifications = unreadNotifications.filter(
		(notification: any) => notification.sender === data?._id
	).length;
	return (
		<Link
			href={`/conversation/${data?._id}`}
			className={`flex cursor-pointer items-center hover:bg-background-default-hover`}
		>
			<div className="min-w-fit px-5 pt-3 pb-1">
				<div className="cursor-pointer relative w-12 h-12 ">
					<Image
						src={`data:image/svg+xml;base64,${data.avatarImage}`}
						fill
						alt="avatar"
						className="object-cover rounded-full "
					/>
					<span
						className={`rounded-full p-1 inline-block absolute top-0 right-2 ${
							onlineUsers.includes(data?._id) ? "bg-green-500 " : "bg-red-500"
						}`}
					></span>
				</div>
			</div>
			<div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
				<div className="flex justify-between">
					<div>
						<span className="text-white">{data?.username}</span>
					</div>
					{pageType === "default" && (
						<div>
							<span
								className={`${
									data.totalUnreadMessages > 0
										? "text-secondary"
										: "text-icon-green"
								} text-sm`}
							>
								{calculateTime(data?.createdAt)}
							</span>
						</div>
					)}
				</div>
				<div className="flex border-b border-conversation-border pb-2 pt-1 ">
					<div className="flex justify-between w-full">
						<span className="text-secondary line-clamp-1 text-sm">
							{pageType !== "default" ? (
								""
							) : (
								<div className="flex items-center gap-1 max-w-[200px] sm:max-w[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px] ">
									{data?.sender?._id === userInfo?._id && (
										<MessageStatus messageStatus={data?.messageStatus} />
									)}
									{data.type === "text" && (
										<span className="truncate">{data.message}</span>
									)}
									{data.type === "audio" && (
										<span className="flex gap-1 items-center">
											<FaMicrophone className="text-panel-header-icon" />
										</span>
									)}
									{data.type === "image" && (
										<span className="flex gap-1 items-center">
											<FaCamera className="text-panel-header-icon" />
										</span>
									)}
								</div>
							)}
						</span>
						{(data.totalUnreadMessages > 0 || totalUnreadNotifications > 0) && (
							<span className="bg-icon-green px-[5px] text-sm rounded-full">
								{Number(data.totalUnreadMessages) +
									Number(totalUnreadNotifications)}
							</span>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
}

export default ChatListItem;
