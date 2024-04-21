export interface Notification {
  id: number,
  date: Date;
  message: string;
  active: number;
}

export interface usersNotification {
  user_id: number;
  notification_id: number,
  status: string;
}