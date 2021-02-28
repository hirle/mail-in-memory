import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import { default as DailyRotateFile } from 'winston-daily-rotate-file';
import {LogsConfig} from './Config';
import { Options as MorganOptions } from 'morgan';
import { format as LogFormFormat } from 'logform';
import fs from 'fs';
import path from 'path';

export default class Logger {

  private winstonLogger: WinstonLogger;

  constructor(winstonLogger: WinstonLogger) {
    this.winstonLogger = winstonLogger;
  }

  info(template:string , ...args: any[]) {
    this.winstonLogger.info(template, ...args);
  }
  warn(template:string , ...args: any[]) {
    this.winstonLogger.warn(template, ...args);
  }
  error(template:string , ...args: any[]) {
    this.winstonLogger.error(template, ...args);
  }

  public static create(logsConfig: LogsConfig|undefined): Logger  {
    return logsConfig && logsConfig.dir 
      ? Logger.initializeWFileLogging(logsConfig)
      : Logger.initializeConsoleOnlyLogging();
  }

  static initializeConsoleOnlyLogging(): Logger {
    return new Logger(createLogger({
      level: 'info',
      format: this.getBaseFormat(),
      transports: [Logger.makeConsoleTransport()]
    }));
  }

  static initializeWFileLogging(logsConfig: LogsConfig): Logger {
    return new Logger(createLogger({
      level: logsConfig.level || 'info',
      format: this.getBaseFormat(),
      transports: [
        Logger.makeConsoleTransport(),
        Logger.makeFileTransport(logsConfig.dir, logsConfig.retention )
      ]
    }));
  }

  static getBaseFormat() {
    return LogFormFormat.combine(
      LogFormFormat.splat(),
      LogFormFormat.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      LogFormFormat.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    );
  }
   
  static makeConsoleTransport () {
    return new transports.Console({
      level: 'warn',
      format: LogFormFormat.combine(this.getBaseFormat(), LogFormFormat.colorize())
    })
  }

  static makeFileTransport (dir: string, retention: number|undefined) {

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      return new DailyRotateFile({
        filename: path.join(dir, 'app-%DATE%.log'),
        maxFiles: retention 
      });
    }
}
