"use client";
import {createContext, useContext, useState} from "react";
import {getProfileFromLS} from "../utils/auth";
interface AuthenticationContextInterface {
	userInfo: any;
	setUserInfo: (value: any) => void;
	pageType: string;
	setPageType: (value: string) => void;
	onlineUsers: any;
	setOnlineUsers: (value: any) => void;
	currentChatUser: any;
	setCurrentChatUser: (value: any) => void;
	socket: any;
	setSocket: (value: any) => void;
	notifications: any;
	setNotifications: (value: any) => void;
	messages: any;
	setMessages: (value: any) => void;
	messageSearch: boolean;
	setMessageSearch: (value: boolean) => void;
	incomingVoiceCall: any;
	setIncomingVoiceCall: (value: any) => void;
	voiceCall: any;
	setVoiceCall: (value: any) => void;
	incomingVideoCall: any;
	setIncomingVideoCall: (value: any) => void;
	videoCall: any;
	setVideoCall: (value: any) => void;
	notiMessages: any;
	setNotiMessages: (value: any) => void;
}
const initialAuthenticationContext: AuthenticationContextInterface = {
	userInfo: getProfileFromLS(),
	setUserInfo: () => null,
	pageType: "default",
	setPageType: () => null,
	currentChatUser: {},
	setCurrentChatUser: () => null,
	socket: null,
	setSocket: () => null,
	onlineUsers: [],
	setOnlineUsers: () => null,
	notifications: [],
	setNotifications: () => null,
	messages: [],
	setMessages: () => null,
	messageSearch: false,
	setMessageSearch: () => null,
	incomingVoiceCall: null,
	setIncomingVoiceCall: () => null,
	voiceCall: null,
	setVoiceCall: () => null,
	incomingVideoCall: null,
	setIncomingVideoCall: () => null,
	videoCall: null,
	setVideoCall: () => null,
	notiMessages: [],
	setNotiMessages: () => null,
};

const AuthenticationContext = createContext<AuthenticationContextInterface>(
	initialAuthenticationContext
);
const AuthenticationProvider = ({children}: {children: React.ReactNode}) => {
	const [userInfo, setUserInfo] = useState(
		initialAuthenticationContext.userInfo
	);
	const [pageType, setPageType] = useState(
		initialAuthenticationContext.pageType
	);
	const [socket, setSocket] = useState(null);
	const [currentChatUser, setCurrentChatUser] = useState<any>(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [notifications, setNotifications] = useState<any>([]);
	const [messages, setMessages] = useState<any>([]);
	const [notiMessages, setNotiMessages] = useState<any>([]);
	const [messageSearch, setMessageSearch] = useState(false);
	const [incomingVoiceCall, setIncomingVoiceCall] = useState<any>(null);
	const [voiceCall, setVoiceCall] = useState<any>(null);
	const [incomingVideoCall, setIncomingVideoCall] = useState<any>(null);
	const [videoCall, setVideoCall] = useState<any>(null);
	return (
		<AuthenticationContext.Provider
			value={{
				userInfo,
				setUserInfo,
				currentChatUser,
				setCurrentChatUser,
				socket,
				setSocket,
				pageType,
				setPageType,
				onlineUsers,
				setOnlineUsers,
				notifications,
				setNotifications,
				messages,
				setMessages,
				messageSearch,
				setMessageSearch,
				incomingVoiceCall,
				setIncomingVoiceCall,
				voiceCall,
				setVoiceCall,
				incomingVideoCall,
				setIncomingVideoCall,
				videoCall,
				setVideoCall,
				notiMessages,
				setNotiMessages,
			}}
		>
			{children}
		</AuthenticationContext.Provider>
	);
};

const useAuthentication = () => {
	const context = useContext(AuthenticationContext);
	if (typeof context === "undefined") {
		throw new Error("useAuthentication must be within AuthenticationProvider");
	}
	return context;
};

export {AuthenticationProvider, useAuthentication};
