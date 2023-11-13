import {useAuthentication} from "@/contexts/app.context";
import {GET_INITIAL_CONTACTS_ROUTE} from "@/utils/APIRoutes";
import axios from "axios";
import React, {useEffect, useState} from "react";
import ChatListItem from "./ChatListItem";

function List() {
	const {userInfo} = useAuthentication();
	const [userContacts, setUserContacts] = useState([]);
	const [onlineUsers, setOnlineUsers] = useState([]);

	useEffect(() => {
		const getContacts = async () => {
			try {
				const {
					data: {users, onlineUsers},
				} = await axios(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`);
				setOnlineUsers(onlineUsers);
				setUserContacts(users);
			} catch (error) {}
		};
		if (userInfo?._id) {
			getContacts();
		}
	}, []);
	return (
		<div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
			{userContacts.map((contact) => (
				<ChatListItem data={contact} key={contact._id} />
			))}
		</div>
	);
}

export default List;
