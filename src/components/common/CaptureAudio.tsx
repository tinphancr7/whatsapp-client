import {useAuthentication} from "@/contexts/app.context";
import {ADD_AUDIO_MESSAGE_ROUTE} from "@/utils/APIRoutes";
import axios from "axios";
import React, {useEffect, useRef, useState} from "react";
import {
	FaMicrophone,
	FaPauseCircle,
	FaPlay,
	FaStop,
	FaTrash,
} from "react-icons/fa";
import {MdSend} from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

function CaptureAudio({hide, currentChatUser, setMessage, setMessages}: any) {
	const {userInfo, socket} = useAuthentication();
	console.log("userInfo", userInfo);
	const [isRecording, setIsRecording] = useState(false);
	const [recordedAudio, setRecordedAudio] = useState<any>(null);
	const [waveForm, setWaveForm] = useState<any>(null);
	const [recordingDuration, setRecordingDuration] = useState<any>(0);
	const [currentPlaybackTime, setCurrentPlaybackTime] = useState<any>(0);
	const [totalDuration, setTotalDuration] = useState<any>(0);
	const [isPlaying, setIsPlaying] = useState<any>(false);
	const [renderedAudio, setRenderedAudio] = useState<any>(null);

	const audioRef = useRef<any>(null);
	const mediaRecorderRef = useRef<any>(null);
	const waveFormRef = useRef<any>(null);

	useEffect(() => {
		let interval: any;
		if (isRecording) {
			interval = setInterval(() => {
				setRecordingDuration((prev: any) => {
					setTotalDuration(prev + 1);
					return prev + 1;
				});
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isRecording]);
	useEffect(() => {
		const waveSurfer = WaveSurfer.create({
			container: waveFormRef.current,
			waveColor: "#ccc",
			progressColor: "#4a9eff",
			cursorColor: "#7ae3c3",
			barWidth: 2,
			barRadius: 3,
			height: 30,
			barGap: 3,
		});

		setWaveForm(waveSurfer);
		waveSurfer.on("finish", () => {
			setIsPlaying(false);
		});
		return () => {
			waveSurfer.destroy();
		};
	}, []);
	useEffect(() => {
		if (waveForm) {
			handleStartRecording();
		}
	}, [waveForm]);

	useEffect(() => {
		if (recordedAudio) {
			console.log("recordedAudio", recordedAudio);
			const updatePlaybackTime = () => {
				setCurrentPlaybackTime(recordedAudio.currentTime);
			};
			recordedAudio?.addEventListener("timeupdate", updatePlaybackTime);
			return () => {
				recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
			};
		}
	}, [recordedAudio]);
	const handlePlayRecording = () => {
		if (recordedAudio) {
			waveForm.stop();
			waveForm.play();
			recordedAudio.play();
			setIsPlaying(true);
		}
	};
	const handlePauseRecording = () => {
		waveForm.stop();
		recordedAudio.pause();
		setIsPlaying(false);
	};
	const handleStartRecording = () => {
		try {
			setRecordingDuration(0);
			setCurrentPlaybackTime(0);
			setTotalDuration(0);
			setIsRecording(true);
			setRecordedAudio(null);
			navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
				const mediaRecorder = new MediaRecorder(stream);
				mediaRecorderRef.current = mediaRecorder;
				audioRef.current.srcObject = stream;
				const chunks: any = [];
				mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
				mediaRecorder.onstop = (e) => {
					const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
					const audioURL = window.URL.createObjectURL(blob);
					const audio = new Audio(audioURL);
					console.log("audio", audio);
					setRecordedAudio(audio);
					waveForm.load(audioURL);
				};
				mediaRecorder.start();
			});
		} catch (error) {
			console.log(error);
		}
	};
	const handleStopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
			waveForm.stop();

			const audioChunks: any = [];
			mediaRecorderRef.current.addEventListener(
				"dataavailable",
				(event: any) => {
					audioChunks.push(event.data);
				}
			);
			mediaRecorderRef.current.addEventListener("stop", () => {
				const audioBlob = new Blob(audioChunks, {
					type: "audio/mp3",
				});
				const audioFile = new File([audioBlob], "recording.mp3");
				setRenderedAudio(audioFile);
			});
		}
	};
	const sendRecording = async () => {
		try {
			const formData = new FormData();
			formData.append("audio", renderedAudio);
			const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				params: {
					from: userInfo?._id,
					to: currentChatUser?._id,
				},
			});
			if (response.status == 201) {
				socket.current.emit("send-msg", {
					to: currentChatUser?._id,
					from: userInfo?._id,
					message: response.data.message,
				});

				setMessages((prevMessages: any) => [
					...prevMessages,
					{
						...response.data.message,
					},
				]);
				setMessage("");
			}
		} catch (error) {}
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
		<div className="flex text-2xl w-full items-center justify-end">
			<div className="pt-1">
				<FaTrash
					className="text-panel-header-icon cursor-pointer text-sm"
					onClick={() => hide()}
				/>
			</div>
			<div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 items-center justify-center bg-search-input-container-background rounded-full drop-shadow-sm">
				{isRecording ? (
					<div className="text-red-500 animate-pulse z-60 text-center text-xs">
						Recording <span>{recordingDuration}s</span>
					</div>
				) : (
					<div>
						{recordedAudio && (
							<>
								{!isPlaying ? (
									<FaPlay onClick={handlePlayRecording} />
								) : (
									<FaStop onClick={handlePauseRecording} />
								)}
							</>
						)}
					</div>
				)}
				<div className="w-60" ref={waveFormRef} hidden={isRecording} />
				{recordedAudio && isPlaying && (
					<span>{formatTime(currentPlaybackTime)}</span>
				)}
				{recordedAudio && !isPlaying && (
					<span>{formatTime(totalDuration)}</span>
				)}
				<audio ref={audioRef} hidden />
				<div className="mr-4">
					{!isRecording ? (
						<FaMicrophone
							className="text-red-500 cursor-pointer"
							onClick={handleStartRecording}
						/>
					) : (
						<FaPauseCircle
							className="text-red-500 cursor-pointer"
							onClick={handleStopRecording}
						/>
					)}
				</div>
				<div>
					<MdSend
						className="text-panel-header-icon cursor-pointer mr-4"
						onClick={sendRecording}
					/>
				</div>
			</div>
		</div>
	);
}

export default CaptureAudio;
