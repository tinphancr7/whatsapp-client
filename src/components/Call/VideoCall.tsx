import {useAuthentication} from "@/contexts/app.context";
import {useEffect} from "react";

function VideoCall({videoCall}: any) {
	const {userInfo, socket} = useAuthentication();
	useEffect(() => {
		if (videoCall.callType === "out-going") {
			socket.current.emit("outgoing-video-call", {
				to: videoCall._id,
				from: {
					id: userInfo._id,
					name: userInfo.name,
					profilePicture: userInfo.profileImage,
				},
				callType: videoCall.callType,
				roomId: videoCall.roomId,
			});
		}
	}, []);
	return <div>VideoCall</div>;
}

export default VideoCall;
