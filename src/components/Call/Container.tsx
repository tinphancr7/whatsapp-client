import {useAuthentication} from "@/contexts/app.context";
import {GET_CALL_TOKEN} from "@/utils/APIRoutes";
import axios from "axios";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {MdOutlineCallEnd} from "react-icons/md";

function Container({data}: any) {
	const {
		userInfo,
		socket,
		setIncomingVoiceCall,
		setIncomingVideoCall,
		setVoiceCall,
		setVideoCall,
	} = useAuthentication();

	const [callAccepted, setCallAccepted] = useState(false);
	const [token, setToken] = useState(undefined);
	const [zgVar, setZgVar] = useState<any>(undefined);
	const [localStream, setLocalStream] = useState<any>(undefined);
	const [publishStream, setPublishStream] = useState<any>(undefined);

	useEffect(() => {
		if (data.type === "out-going") {
			socket.current.on("accept-call", () => setCallAccepted(true));
		} else {
			setTimeout(() => {
				setCallAccepted(true);
			}, 1000);
		}
	}, [data]);

	useEffect(() => {
		const getToken = async () => {
			try {
				const {
					data: {token: returnedToken},
				} = await axios.get(`${GET_CALL_TOKEN}/${userInfo._id}`);
				setToken(returnedToken);
			} catch (error) {
				console.log(error);
			}
		};
		getToken();
	}, [callAccepted]);

	useEffect(() => {
		const startCall = async () => {
			import("zego-express-engine-webrtc").then(async ({ZegoExpressEngine}) => {
				const zg = new ZegoExpressEngine(
					Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID),
					process.env.NEXT_PUBLIC_ZEGO_SERVER_ID as string
				);
				setZgVar(zg);
				zg.on(
					"roomStreamUpdate",
					async (roomID: any, updateType, streamList, extendedData) => {
						if (updateType === "ADD") {
							const rmVideo = document.getElementById("remote-video");
							const vd = document.createElement("video");
							vd.id = streamList[0].streamID;
							vd.autoplay = true;
							vd.playsInline = true;
							vd.muted = false;

							if (rmVideo) {
								rmVideo.appendChild(vd);
							}
							zg.startPlayingStream(streamList[0].streamID, {
								audio: true,
								video: true,
							}).then((stream) => (vd.srcObject = stream));
						} else if (
							updateType === "DELETE" &&
							zg &&
							localStream &&
							streamList[0].streamID
						) {
							zg.destroyStream(localStream);
							zg.stopPublishingStream(streamList[0]?.streamID);
							zg.logoutRoom(data.roomId.toString());

							setIncomingVoiceCall(false);
							setIncomingVideoCall(false);
							setVoiceCall(false);
							setVideoCall(false);
						}
					}
				);
				await zg.loginRoom(
					data.roomId.toString(),
					token,
					{
						userID: userInfo?._id.toString(),
						userName: userInfo?.username,
					},
					{
						userUpdate: true,
					}
				);

				const localStream = await zg.createStream({
					camera: {
						audio: true,
						video: true,
					},
				});
				const localVideo = document.getElementById("local-video");
				const videoElement = document.createElement("video");

				videoElement.id = "video-local-zego";
				videoElement.className = "h-28 w-28";
				videoElement.autoplay = true;
				videoElement.muted = false;
				videoElement.playsInline = true;
				localVideo?.appendChild(videoElement);
				const td = document.getElementById("video-local-zego");
				td.srcObject = localStream;
				const streamID = "123" + Date.now();
				setPublishStream(streamID);
				setLocalStream(localStream);
				zg.startPublishingStream(streamID, localStream);
			});
		};
		if (token) {
			startCall();
		}
	}, [token]);

	const endCall = () => {
		const id = data._id;
		if (data.callType === "voice") {
			socket.current.emit("reject-voice-call", {
				from: id,
			});
			if (zgVar && localStream && publishStream) {
				zgVar.destroyStream(localStream);
				zgVar.stopPublishingStream(publishStream);
				zgVar.logoutRoom(data.roomId.toString());
			}
		} else {
			socket.current.emit("reject-video-call", {
				from: id,
			});
		}
		setIncomingVoiceCall(false);
		setIncomingVideoCall(false);
		setVoiceCall(false);
		setVideoCall(false);
	};
	return (
		<div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh]  overflow-hidden items-center justify-center text-white">
			<div className="flex flex-col gap-3 items-center">
				<span className="text-2xl">{data.username}</span>
				<span className="text-lg">
					{callAccepted && data.callType !== "video"
						? "On going call"
						: "Calling"}
				</span>
			</div>

			{(!callAccepted || data.callType === "audio") && (
				<div className="my-12">
					<Image
						src={`data:image/svg+xml;base64,${data?.avatarImage}`}
						alt="avatar"
						height={150}
						width={150}
						className="rounded-full"
					/>
				</div>
			)}
			<div className="relative" id="remote-video">
				<div className="absolute top-0 right-0" id="local-video"></div>
			</div>
			<div className="h-12 w-12 bg-red-600 flex items-center justify-center rounded-full">
				<MdOutlineCallEnd
					className="text-2xl cursor-pointer"
					onClick={endCall}
				/>
			</div>
		</div>
	);
}

export default Container;
