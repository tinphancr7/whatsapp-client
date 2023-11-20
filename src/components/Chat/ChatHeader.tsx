import React from "react";
import {MdCall} from "react-icons/md";
import {BsThreeDotsVertical} from "react-icons/bs";
import {IoVideocam} from "react-icons/io5";
import {BiSearchAlt2} from "react-icons/bi";
import Image from "next/image";
import {useAuthentication} from "@/contexts/app.context";

function ChatHeader() {
	const {
		onlineUsers,
		currentChatUser,
		setVoiceCall,
		setVideoCall,
		setMessageSearch,
	} = useAuthentication();
	const handleVoiceCall = () => {
		setVoiceCall({
			...currentChatUser,
			type: "out-going",
			callType: "voice",
			roomId: Date.now(),
		});
	};
	const handleVideoCall = () => {
		setVideoCall({
			...currentChatUser,
			type: "out-going",
			callType: "video",
			roomId: Date.now(),
		});
	};
	return (
		<div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
			<div className="flex items-center justify-center gap-6">
				<div className="cursor-pointer relative w-12 h-12 ">
					<Image
						src={`data:image/svg+xml;base64,${currentChatUser?.avatarImage}`}
						fill
						alt="avatar"
						className="object-cover rounded-full "
					/>
					<span
						className={`rounded-full p-1 inline-block absolute top-0 right-2 ${
							onlineUsers.includes(currentChatUser?._id)
								? "bg-green-500 "
								: "bg-red-500"
						}`}
					></span>
				</div>
				<div className="flex flex-col">
					<span className="text-primary-strong">
						{currentChatUser?.username}
					</span>
					<span className="text-secondary text-sm">online/offline</span>
				</div>
			</div>
			<div className="flex gap-6">
				<MdCall
					className="text-panel-header-icon cursor-pointer text-xl"
					onClick={handleVoiceCall}
				/>
				<IoVideocam
					className="text-panel-header-icon cursor-pointer text-xl"
					onClick={handleVideoCall}
				/>
				<BiSearchAlt2
					className="text-panel-header-icon cursor-pointer text-xl"
					onClick={() => setMessageSearch((messageSearch) => !messageSearch)}
				/>
				<BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl" />
				{/* {isContextMenuVisible && (
					<ContextMenu
						options={contextMenuOptions}
						coordinates={contextMenuCoordinates}
						contextMenu={isContextMenuVisible}
						setContextMenu={setIsContextMenuVisible}
					/>
				)} */}
			</div>
		</div>
	);
}

export default ChatHeader;
