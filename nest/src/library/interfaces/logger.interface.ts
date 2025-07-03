import { LoggerActions } from "../enums/logger-actions.enum";

export interface jobtype {
  message: string;
  type: LoggerActions;
  context: string;
}
