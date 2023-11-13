"use client";
import {createContext, useContext, useState} from "react";
import {getProfileFromLS} from "../utils/auth";
interface AuthenticationContextInterface {
	userInfo: any;
	setUserInfo: (value: any) => void;
	socket: any;
	setSocket: (value: any) => void;
}
const initialAuthenticationContext: AuthenticationContextInterface = {
	userInfo: getProfileFromLS(),
	setUserInfo: () => null,
	socket: null,
	setSocket: () => null,
};

const AuthenticationContext = createContext<AuthenticationContextInterface>(
	initialAuthenticationContext
);
const AuthenticationProvider = ({children}: {children: React.ReactNode}) => {
	const [userInfo, setUserInfo] = useState(
		initialAuthenticationContext.userInfo
	);

	const [socket, setSocket] = useState(null);

	return (
		<AuthenticationContext.Provider
			value={{
				userInfo,
				setUserInfo,
				socket,
				setSocket,
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
