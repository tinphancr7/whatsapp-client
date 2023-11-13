import React, {useEffect, useState} from "react";
import {BiArrowBack, BiSearchAlt2} from "react-icons/bi";
import ChatListItem from "./ChatListItem";
import axios from "axios";
import {useAuthentication} from "@/contexts/app.context";
import {GET_ALL_CONTACTS} from "@/utils/APIRoutes";

function ContactsList({setPageType}: any) {
	const {userInfo} = useAuthentication();
	const [allContacts, setAllContacts] = useState({});

	useEffect(() => {
		const getContacts = async () => {
			const {
				data: {users},
			} = await axios.get(`${GET_ALL_CONTACTS}/${userInfo._id}`);
			setAllContacts({...users});
		};
		getContacts();
	}, [userInfo._id]);
	return (
		<>
			<div className="h-full flex flex-col">
				<div className="h-24 flex items-end px-3 py-4">
					<div className="flex items-center gap-12 text-white">
						<BiArrowBack
							className="cursor-pointer text-xl"
							onClick={() => setPageType("default")}
						/>
						<span>New chat</span>
					</div>
				</div>

				<div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
					<div className="flex py-3 items-center gap-3 h-14">
						<div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
							<div>
								<BiSearchAlt2 className=" atext-panel-header-icon cursor-pointer text-left" />
							</div>
							<div>
								<input
									type="text"
									placeholder=" Search Contacts"
									className="bg-transparent text-sm focus:outline-none"
								/>
							</div>
						</div>
					</div>
					{Object.entries(allContacts).map(([initialLetter, userList]) => {
						return (
							<div key={Date.now() + initialLetter}>
								<div className="text-teal-light pl-10 py-5 ">
									{initialLetter}
								</div>
								{userList.map((contact, index) => {
									return (
										<div key={index}>
											<ChatListItem data={contact} />
										</div>
									);
								})}
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}

export default ContactsList;
