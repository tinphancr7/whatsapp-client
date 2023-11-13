export const setAccessTokenToLS = (accessToken: string) => {
	localStorage.setItem("accessToken", accessToken);
};

export const clearLS = () => {
	localStorage.removeItem("accessToken");
	localStorage.removeItem("profile");
};

export const getAccessTokenFromLS = () => {
	return localStorage.getItem("accessToken") || "";
};

export const getProfileFromLS = () => {
	const result = localStorage.getItem("profile");
	return result ? JSON.parse(result) : null;
};
export const setProfileToLS = (profile: any) => {
	localStorage.setItem("profile", JSON.stringify(profile));
};
