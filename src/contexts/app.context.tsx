"use client";
import {createContext, useContext, useState} from "react";
import {getProfileFromLS} from "../utils/auth";
interface AuthenticationContextInterface {
	userInfo: any;
	setUserInfo: (value: any) => void;
	pageType?: string;
	setPageType?: (value: string) => void;
	onlineUsers?: any;
	setOnlineUsers: (value: any) => void;
	currentChatUser?: any;
	setCurrentChatUser?: (value: any) => void;
	socket: any;
	setSocket: (value: any) => void;
	notifications?: any;
	setNotifications?: (value: any) => void;
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
	const [currentChatUser, setCurrentChatUser] = useState<any>({});
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [notifications, setNotifications] = useState<any>([]);
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
