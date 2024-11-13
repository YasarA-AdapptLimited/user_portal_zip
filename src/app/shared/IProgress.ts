export interface IProgress {
  total: number;
  progress: number;
  completed: boolean;
  invalid: boolean;
  error?: boolean;
}
