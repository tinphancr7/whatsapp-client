import React, {useEffect} from "react";
import Container from "./Container";
import {useAuthentication} from "@/contexts/app.context";

function VoiceCall({voiceCall, userInfo, socket}: any) {
	useEffect(() => {
		if (voiceCall.type === "out-going") {
			socket.current.emit("outgoing-voice-call", {
				to: voiceCall._id,
				from: {
					_id: userInfo._id,
					username: userInfo.username,
					avatarImage: userInfo.avatarImage,
				},
				callType: voiceCall.callType,
				roomId: voiceCall.roomId,
			});
		}
	}, [voiceCall]);
	return <Container data={voiceCall} />;
}

export default VoiceCall;
