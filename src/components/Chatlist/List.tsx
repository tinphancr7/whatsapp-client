import {useAuthentication} from "@/contexts/app.context";
import {GET_INITIAL_CONTACTS_ROUTE} from "@/utils/APIRoutes";
import axios from "axios";
import React, {Fragment, useEffect, useState} from "react";
import ChatListItem from "./ChatListItem";

function List() {
	const {userInfo, setCurrentChatUser, notifications} = useAuthentication();
	const [userContacts, setUserContacts] = useState([]);

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
						<ChatListItem
							notifications={notifications}
							data={contact}
							setCurrentChatUser={setCurrentChatUser}
							userInfo={userInfo}
						/>
					</Fragment>
				))}
		</div>
	);
}

export default List;
