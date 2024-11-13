import { LogLevel } from './LogLevel';

export interface Log {
  date: any;
  level: LogLevel;
  text: string;
  data: any[];
  exception?: any;
  routeBlock?: boolean;
  routeBlocked?: string;
}
