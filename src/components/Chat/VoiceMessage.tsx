import {useAuthentication} from "@/contexts/app.context";
import {host} from "@/utils/APIRoutes";
import React, {useEffect, useRef, useState} from "react";
import WaveSurfer from "wavesurfer.js";

function VoiceMessage({message}: any) {
	const {userInfo} = useAuthentication();
	const [audioMessage, setAudioMessage] = useState<any>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentPlaybackTime, setCurrentPlaybackTime] = useState<any>(0);
	const [totalDuration, setTotalDuration] = useState<any>(0);

	const waveFormRef = useRef<any>(null);
	const waveForm = useRef<any>(null);

	useEffect(() => {
		if (waveForm.current === null) {
			waveForm.current = WaveSurfer.create({
				container: waveFormRef.current,
				waveColor: "#ccc",
				progressColor: "#4a9eff",
				cursorColor: "#7ae3c3",
				barWidth: 2,
				barRadius: 3,
				height: 30,
				barGap: 3,
			});

			waveForm.current.on("finish", () => {
				setIsPlaying(false);
			});
		}
		return () => {
			waveForm.current.destroy();
		};
	}, []);
	useEffect(() => {
		const audioUrl = `${host}/${message.message}`;
		const audio = new Audio(audioUrl);
		setAudioMessage(audio);
		waveForm.current.load(audioUrl);
		waveForm.current.on("ready", () => {
			setTotalDuration(waveForm.current.getDuration());
		});
	}, [message.message]);
	useEffect(() => {
		if (waveForm) {
			handleStartRecording();
		}
	}, [waveForm]);
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
	return <div>VoiceMessage</div>;
}

export default VoiceMessage;
