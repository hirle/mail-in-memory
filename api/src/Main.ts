import DbConnector from "./DbConnector";
import MailListener from "./MailListener";
import MailRecorderToDb from "./MailRecorderToDb";
import DefaultConfig from './default.config.json';
import Config from './Config';
import fs from 'fs';
import Logger from "./Logger";

export function main(argv: string[]): number {
    
    const config = processArgv(argv);

    Logger.initialize(config.logs);

    const mailListener = new MailListener();

    const dbConnector = new DbConnector(config.db);
    const mailRecorder: MailRecorderToDb = new MailRecorderToDb(dbConnector);
    mailListener.subscribe(mailRecorder);
    mailListener.start(config["smtp-port"], Logger.getAppLogger());

    return 0;
}

function processArgv(argv: string[]): Config {
    switch( argv.length ) 
    { case 1: return DefaultConfig; 
      case 2: throw new Error('Missing argument: ./path/to/config.json');
      case 3: if( argv[2] === '--config' ) {
          return JSON.parse(fs.readFileSync(argv[2], 'utf8'))
        }  else {
          throw new Error('Bad argument');
        } 
      default:  
        throw new Error('Bad argument');
    }
  }