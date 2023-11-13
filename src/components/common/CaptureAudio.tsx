import {ADD_AUDIO_MESSAGE_ROUTE} from "@/utils/ApiRoutes";
import React, {useEffect} from "react";
import {FaMicrophone, FaPauseCircle, FaPlay, FaTrash} from "react-icons/fa";
import {MdSend} from "react-icons/md";

function CaptureAudio({hide}) {
	const [{userInfo, currentChatUser, socket}, dispatch] = useStateProvider();
	const [isRecording, setIsRecording] = useState(false);
	const [recordedAudio, setRecordedAudio] = useState(null);
	const [waveForm, setWaveForm] = useState(null);
	const [recordingDuration, setRecordingDuration] = useState(0);
	const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
	const [totalDuration, setTotalDuration] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	const audioRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const waveFormRef = useRef(null);

	useEffect(() => {
		const waveSurfer = WaveSurfer.create({
			container: waveFormRef.current,
			waveColor: "#ccc",
			progressColor: "#4a9eff",
			cursorColor: "#7ae3c3",
			barWidth: 2,
			barRadius: 3,
			responsive: true,
			height: 40,
			barGap: 3,
			barMinHeight: 0.5,
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
	const handlePlayRecording = () => {};
	const handlePauseRecording = () => {};
	const handleStartRecording = () => {
		try {
			setRecordingDuration(0);
			setIsRecording(true);
			setCurrentPlaybackTime(0);
			setTotalDuration(0);
			setIsRecording(true);
			setRecordedAudio(null);
			navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
				const mediaRecorder = new MediaRecorder(stream);
				mediaRecorderRef.current.srcObject = stream;
				const chunks = [];
				mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
				mediaRecorder.onstop = (e) => {
					const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
					const audioURL = window.URL.createObjectURL(blob);
					const audio = new Audio(audioURL);
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

			const audioChunks = [];
			mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
				audioChunks.push(event.data);
			});
			mediaRecorderRef.current.addEventListener("stop", () => {
				const audioBlob = new Blob(audioChunks, {
					type: "audio/mp3",
				});
				const audioFile = new File([audioBlob], "recording.mp3");
				setRecordedAudio(audioFile);
			});
		}
	};
	const sendRecording = () => {
		try {
			const formData = new FormData();
			formData.append("audio", renderedAudio);
			const response = axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				params: {
					form: userInfo?._id,
					to: currentChatUser?._id,
				},
			});
			if (response.status == 201) {
				socket.current.emit("send-msg", {
					to: currentChatUser?._id,
					from: userInfo?._id,
					message: response.data.message,
				});
				dispatch({
					type: reducerCases.ADD_MESSAGE,
					newMessage: {
						...response.data.message,
					},
					fromSelf: true,
				});
				setMessage("");
			}
		} catch (error) {}
	};

	const formatTime = (time) => {
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
				<FaTrash className="text-panel-header-icon" onClick={() => hide()} />
			</div>
			<div className="mx-4 py-2 text-white text-lg flex gap-3 items-center justify-center bg-search-input-container-background rounded-full ">
				{isRecording ? (
					<div className="text-red-500 animate-pulse z-60 text-center">
						Recording <span>{recordingDuration}s</span>
					</div>
				) : (
					<div>
						{recordedAudio && (
							<>
								{isPlaying ? (
									<FaPlay onClick={handlePlayRecording} />
								) : (
									<FaStop onClick={handlePauseRecording} />
								)}
							</>
						)}
					</div>
				)}
				<div className="w-60" ref={waveFormRef} hidden={isRecording}>
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
								className="text-red-500"
								onClick={handleStartRecording}
							/>
						) : (
							<FaPauseCircle
								className="text-red-500"
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
		</div>
	);
}

export default CaptureAudio;
