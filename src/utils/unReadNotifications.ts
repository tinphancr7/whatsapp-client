export const unReadNotificationsFunc = (notifications: any[]) => {
	return notifications.filter((notification) => !notification.isRead);
};
