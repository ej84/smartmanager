import { Timestamp } from 'firebase/firestore';

export interface UserSettings {
  notificationDays: number[];
  currency: string;
  timezone: string;
  emailNotifications: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date | Timestamp;
  settings: UserSettings;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  notificationDays: [7, 3, 1],
  currency: 'USD',
  timezone: 'America/New_York',
  emailNotifications: true,
};