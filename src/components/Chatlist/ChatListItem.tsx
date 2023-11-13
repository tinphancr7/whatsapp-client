import React from "react";
import Avatar from "../common/Avatar";
import {useAuthentication} from "@/contexts/app.context";
import Image from "next/image";
import Link from "next/link";
interface ChatListItemProps {
	data: any;
	isContactsPage?: boolean;
}
function ChatListItem({data, isContactsPage = false}: ChatListItemProps) {
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
				</div>
			</div>
			<div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
				<div className="flex justify-between">
					<div>
						<span className="text-white">{data?.username}</span>
					</div>
				</div>
			</div>
		</Link>
	);
}

export default ChatListItem;
