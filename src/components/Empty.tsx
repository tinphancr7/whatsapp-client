import Image from "next/image";
import React from "react";

function Empty({userInfo}: any) {
	return (
		<div className="border-conversation-border border-l w-full bg-panel-header-background flex flex-col h-[100vh] border-b-4 border-b-icon-green items-center justify-center text-white">
			<Image src="/images/robot.gif" alt="" height={300} width={300} />
			<h1 className="text-2xl">
				Welcome, <span>{userInfo?.username}!</span>
			</h1>
			<h3>Please select a chat to Start messaging.</h3>
		</div>
	);
}

export default Empty;
