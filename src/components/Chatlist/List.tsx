import {useAuthentication} from "@/contexts/app.context";
import {GET_INITIAL_CONTACTS_ROUTE} from "@/utils/APIRoutes";
import axios from "axios";
import React, {Fragment, useEffect, useState} from "react";
import ChatListItem from "./ChatListItem";

function List() {
	const {userInfo, notiMessages, currentChatUser} = useAuthentication();
	const [userContacts, setUserContacts] = useState([]);
	console.log("notiMessages", notiMessages);
	const notiMessagesData = new Map();

	notiMessages
		.filter((item) => item.sender !== currentChatUser?._id)
		.forEach((msg) => {
			const isSender = msg.sender === userInfo?._id;

			const calculatedId = isSender ? msg.receiver : msg.sender;

			const {_id, type, message, messageStatus, createdAt, sender, receiver} =
				msg;

			if (!notiMessagesData.get(calculatedId)) {
				let user = {
					messageId: _id,
					type,
					message,
					messageStatus,
					createdAt,
					sender,
					receiver,
				};
				if (isSender) {
					user = {
						...user,
						totalUnreadMessages: 0,
					};
				} else {
					user = {
						...user,
						totalUnreadMessages: messageStatus !== "read" ? 1 : 0,
					};
				}
				notiMessagesData.set(calculatedId, {
					...user,
				});
			} else if (messageStatus !== "read" && !isSender) {
				const user = notiMessagesData.get(calculatedId);
				notiMessagesData.set(calculatedId, {
					...user,
					totalUnreadMessages: user.totalUnreadMessages + 1,
				});
			}
		});

	useEffect(() => {
		const getContacts = async () => {
			try {
				const {
					data: {users},
				} = await axios(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo._id}`);
				setUserContacts(users);
			} catch (error) {
				console.log(error);
			}
		};
		if (userInfo?._id) {
			getContacts();
		}
	}, [userInfo?._id]);
	return (
		<div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
			{userContacts.length > 0 &&
				userContacts?.map((contact, index) => (
					<Fragment key={index}>
						<ChatListItem data={contact} notiMessagesData={notiMessagesData} />
					</Fragment>
				))}
		</div>
	);
}

export default List;
