import {useAuthentication} from "@/contexts/app.context";
import Image from "next/image";
import React from "react";

function IncomingCall({
	incomingVoiceCall,
	setIncomingVoiceCall,
	setVoiceCall,
}: any) {
	const {socket} = useAuthentication();
	const acceptCall = () => {
		setVoiceCall({
			...incomingVoiceCall,
			callType: "in-coming",
		});
		socket.current.emit("accept-incoming-call", {
			id: incomingVoiceCall?._id,
		});
		setIncomingVoiceCall(null);
	};
	const rejectCall = () => {
		socket.current.emit("reject-voice-call", {
			from: incomingVoiceCall?._id,
		});
		setVoiceCall(null);
		setIncomingVoiceCall(null);
	};
	return (
		<div className="h-24 w-80 fixed bottom-8  mb-0 right-6 z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14">
			<div>
				<Image
					src={`data:image/svg+xml;base64,${incomingVoiceCall?.avatarImage}`}
					alt="avatar"
					width={70}
					height={70}
					className="rounded-full"
				/>
			</div>
			<div>
				<div>
					{incomingVoiceCall?.username}
					<div className="text-xs">Incoming Voice Call</div>
					<div className="flex gap-2 mt-2">
						<button
							className="bg-red-500 p-1 px-3 text-sm rounded-full"
							onClick={rejectCall}
						>
							Reject
						</button>
						<button
							className="bg-green-500 p-1 px-3 text-sm rounded-full"
							onClick={acceptCall}
						>
							Accept
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default IncomingCall;
