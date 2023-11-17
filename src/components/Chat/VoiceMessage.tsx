import {useAuthentication} from "@/contexts/app.context";
import {host} from "@/utils/APIRoutes";
import {calculateTime} from "@/utils/CalculateTime";
import Image from "next/image";
import React, {useEffect, useRef, useState} from "react";
import {FaPlay, FaStop} from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";
import MessageStatus from "../common/MessageStatus";

function VoiceMessage({message, currentChatUser}: any) {
	const {userInfo} = useAuthentication();
	const [audioMessage, setAudioMessage] = useState<any>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentPlaybackTime, setCurrentPlaybackTime] = useState<any>(0);
	const [totalDuration, setTotalDuration] = useState<any>(0);

	const waveFormRef = useRef<any>(null);
	const waveForm = useRef<any>(null);

	useEffect(() => {
		waveForm.current = WaveSurfer.create({
			container: waveFormRef.current,
			waveColor: "violet",
			progressColor: "purple",
			cursorColor: "#7ae3c3",
			barWidth: 2,
			barRadius: 3,
			height: 30,
			barGap: 3,
		});

		waveForm.current.on("finish", () => {
			setIsPlaying(false);
		});
		return () => {
			waveForm.current.destroy();
		};
	}, []);
	useEffect(() => {
		try {
			const audioUrl = `${host}/${message.message}`;

			const audio = new Audio(audioUrl);

			setAudioMessage(audio);
			waveForm.current && waveForm.current.load(audioUrl);
			waveForm.current.on("ready", () => {
				setTotalDuration(waveForm.current.getDuration());
			});
		} catch (error) {
			console.log("error", error);
		}
	}, [message.message]);

	useEffect(() => {
		if (audioMessage) {
			const updatePlaybackTime = () => {
				setCurrentPlaybackTime(audioMessage.currentTime);
			};
			audioMessage?.addEventListener("timeupdate", updatePlaybackTime);
			return () => {
				audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
			};
		}
	}, [audioMessage]);
	const handlePlayAudio = () => {
		if (audioMessage) {
			waveForm.current.stop();
			waveForm.current.play();
			audioMessage.play();
			setIsPlaying(true);
		}
	};
	const handlePauseAudio = () => {
		waveForm.current.stop();
		audioMessage.pause();
		setIsPlaying(false);
	};
	const formatTime = (time: any) => {
		if (!time) return "00:00";
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return ` ${minutes.toString().padStart(2, "0")}:${seconds
			.toString()
			.padStart(2, "0")}`;
	};
	return (
		<div
			className={`flex items-center gap-5 text-white px-4 pr-2 py-4 text-sm rounded-md ${
				message?.sender === currentChatUser?._id
					? "bg-incoming-background"
					: "bg-outgoing-background"
			}`}
		>
			<div className="h-14 w-14 relative">
				<Image
					className="object-cover"
					fill
					src={`data:image/svg+xml;base64,${currentChatUser?.avatarImage}`}
					alt=""
				/>
			</div>
			<div className="cursor-pointer text-xl">
				{!isPlaying ? (
					<FaPlay onClick={handlePlayAudio} />
				) : (
					<FaStop onClick={handlePauseAudio} />
				)}
			</div>

			<div className="relative">
				<div className="w-60 " ref={waveFormRef} />
				<div className="text-bubble-meta pt-1 text-xs flex items-center justify-between absolute w-full bottom-[-22px]">
					<span>
						{formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
					</span>
					<div className="flex gap-1">
						<span>{calculateTime(message?.createdAt)}</span>
						{message.sender === userInfo._id && (
							<MessageStatus messageStatus={message.messageStatus} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default VoiceMessage;
