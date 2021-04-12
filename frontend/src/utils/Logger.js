import { LoggerConf } from "./config";

// Class to provide logging functionality
export class Logger {
  /**
   * Logs the message if the level allows
   * @param {string} msg Message to log
   */
  static error(msg) {
    if (LoggerConf.LOG_LEVEL >= LoggerConf.LEVEL_ERROR) {
      console.error(msg);
    }
  }
  /**
   * Logs the message if the level allows
   * @param {string} msg Message to log
   */
  static warn(msg) {
    if (LoggerConf.LOG_LEVEL >= LoggerConf.LEVEL_WARNING) {
      console.warn(msg);
    }
  }
  /**
   * Logs the message if the level allows
   * @param {string} msg Message to log
   */
  static info(msg) {
    if (LoggerConf.LOG_LEVEL >= LoggerConf.LEVEL_INFO) {
      console.info(msg);
    }
  }
  /**
   * Logs the message if the level allows
   * @param {string} msg Message to log
   */
  static debug(msg) {
    if (LoggerConf.LOG_LEVEL >= LoggerConf.LEVEL_DEBUG) {
      console.log(msg);
    }
  }
}
