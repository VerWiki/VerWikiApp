import { LoggerConf } from "./config";

// Class to provide logging functionality
export class Logger {
  /**
   * Logs the message if the level allows. Allows for an arbitrary number
   * of arguments
   * E.g. Logger.error("First", "Second", "Third");
   */
  static error() {
    if (LoggerConf.LOG_LEVEL >= LoggerConf.LEVEL_ERROR) {
      console.error(...arguments);
    }
  }
  /**
   * Logs the message if the level allows. Allows for an arbitrary number
   * of arguments
   * E.g. Logger.warn("First", "Second", "Third");
   */
  static warn() {
    if (LoggerConf.LOG_LEVEL >= LoggerConf.LEVEL_WARNING) {
      console.warn(...arguments);
    }
  }
  /**
   * Logs the message if the level allows. Allows for an arbitrary number
   * of arguments
   * E.g. Logger.info("First", "Second", "Third");
   */
  static info() {
    if (LoggerConf.LOG_LEVEL >= LoggerConf.LEVEL_INFO) {
      console.info(...arguments);
    }
  }
  /**
   * Logs the message if the level allows. Allows for an arbitrary number
   * of arguments
   * E.g. Logger.debug("First", "Second", "Third");
   */
  static debug() {
    if (LoggerConf.LOG_LEVEL >= LoggerConf.LEVEL_DEBUG) {
      console.log(...arguments);
    }
  }
}
