import {useAuthentication} from "@/contexts/app.context";

import {useEffect} from "react";
import Container from "./Container";

function VideoCall({videoCall, setVideoCall}: any) {
	const {userInfo, socket} = useAuthentication();
	useEffect(() => {
		if (videoCall.type === "out-going") {
			socket.current.emit("outgoing-video-call", {
				to: videoCall._id,
				from: {
					_id: userInfo._id,
					username: userInfo.username,
					avatarImage: userInfo.avatarImage,
				},
				callType: videoCall.callType,
				roomId: videoCall.roomId,
			});
		}
	}, [socket, userInfo._id, videoCall]);
	return <Container data={videoCall} setVideoCall={setVideoCall} />;
}

export default VideoCall;
