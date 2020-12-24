import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import { default as DailyRotateFile } from 'winston-daily-rotate-file';
import {LogsConfig} from './Config';
import { Options as MorganOptions } from 'morgan';
import { Format } from 'logform';
import fs from 'fs';
import path from 'path';

export default class Logger {

  private static appLogger: Logger;

  private winstonLogger: WinstonLogger;

  constructor(winstonLogger: WinstonLogger) {
    this.winstonLogger = winstonLogger;
  }

  info(format:string , ...args: any[]) {
    this.winstonLogger.info(format, ...args);
  }
  warn(format:string , ...args: any[]) {
    this.winstonLogger.warn(format, ...args);
  }
  error(format:string , ...args: any[]) {
    this.winstonLogger.error(format, ...args);
  }

  public static initialize(logsConfig: LogsConfig|undefined) {

    const noLogsDir = {
      dir: '/dev/null',
      retention: 0,
      level: 'info'
    }   
    const effectiveLogsConfig = logsConfig || noLogsDir;

    const logDir = effectiveLogsConfig.dir;

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    const baseFormat: Format = format.combine(
      format.splat(),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    );

    Logger.appLogger = new Logger(createLogger({
      level: effectiveLogsConfig.level || 'info',
      format: baseFormat,
      transports: [
        new transports.Console({
          level: 'warn',
          format: format.combine(baseFormat, format.colorize())
        }),
        new DailyRotateFile({
          filename: path.join(logDir, 'app-%DATE%.log'),
          maxFiles: effectiveLogsConfig.retention
        })
      ]
    }));
  }

  public static getAppLogger(): Logger {
    if (Logger.appLogger === undefined) {
      throw new Error('Logger requires initialization')
    } else {
      return Logger.appLogger;
    }
  }
}
