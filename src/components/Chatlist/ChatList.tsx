"use client";
import React, {useEffect, useState} from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import ContactsList from "./ContactsList";

function ChatList() {
	const [pageType, setPageType] = useState("default");

	return (
		<div className="bg-panel-header-background flex flex-col max-h-screen relative z-50">
			{pageType === "default" && (
				<>
					<ChatListHeader setPageType={setPageType} />
					<SearchBar />
					<List />
				</>
			)}
			{pageType === "all-contacts" && (
				<ContactsList setPageType={setPageType} />
			)}
		</div>
	);
}

export default ChatList;
