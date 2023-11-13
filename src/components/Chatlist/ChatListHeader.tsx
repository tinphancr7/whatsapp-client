import {BsFillChatLeftTextFill, BsThreeDotsVertical} from "react-icons/bs";

import {useAuthentication} from "@/contexts/app.context";
import Image from "next/image";

function ChatListHeader({setPageType}: any) {
	const {userInfo} = useAuthentication();

	const handleAllContactsPage = () => {
		setPageType("all-contacts");
	};
	return (
		<div className="h-16 text-white px-4 py-3 flex justify-between items-center">
			<div className="cursor-pointer relative w-12 h-12 ">
				<Image
					src={`data:image/svg+xml;base64,${userInfo?.avatarImage}`}
					fill
					alt="avatar"
					className="object-cover rounded-full "
				/>
			</div>
			<div className="flex gap-6">
				<BsFillChatLeftTextFill
					className="text-panel-header-icon cursor-pointer text-xl"
					title="New Chat"
					onClick={() => handleAllContactsPage()}
				/>
				<BsThreeDotsVertical
					className="text-panel-header-icon cursor-pointer text-xl"
					title="Menu"
				/>
			</div>
		</div>
	);
}
export default ChatListHeader;
