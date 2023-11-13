import React, {useEffect} from "react";
import Container from "./Container";
import {useAuthentication} from "@/contexts/app.context";

function VoiceCall() {
	const {userInfo, videoCall, voiceCall, socket} = useAuthentication();
	useEffect(() => {
		if (voiceCall.callType === "out-going") {
			socket.current.emit("outgoing-voice-call", {
				to: voiceCall._id,
				from: {
					id: userInfo._id,
					name: userInfo.name,
					profilePicture: userInfo.profilePicture,
				},
				callType: voiceCall.callType,
				roomId: voiceCall.roomId,
			});
		}
	}, []);
	return <Container data={voiceCall} />;
}

export default VoiceCall;
