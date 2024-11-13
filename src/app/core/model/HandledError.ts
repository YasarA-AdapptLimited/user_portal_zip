import { ValidationError } from './ValidationError';

export interface HandledError {

  status;
  statusText?: string;
  message?: string;
  validationErrors?: Array<ValidationError>;
  serverError?: boolean;

}
