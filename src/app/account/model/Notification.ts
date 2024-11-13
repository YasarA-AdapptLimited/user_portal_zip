import { NotificationType } from './NotificationType';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: number;
  sender: string;
  title: string;
  url: string;
  time: string;
  data: any;
  deactivatedAt: string;
  deactivateManually: boolean;
  content: any;
}
