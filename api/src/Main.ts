import DbConnector from "./DbConnector";
import MailListener from "./MailListener";
import MailRecorderToDb from "./MailRecorderToDb";
import DefaultConfig from './default.config.json';
import Config from './Config';
import fs from 'fs';
import Logger from "./Logger";
import SplashScreen from "./SplashScreen";

export function main(argv: string[]): number {
    
    const config = processArgv(argv);

    const logger: Logger = Logger.create(config.logs);

    const mailListener = new MailListener();

    const dbConnector = new DbConnector(config.db);
    const mailRecorder: MailRecorderToDb = new MailRecorderToDb(dbConnector);
    mailListener.subscribe(mailRecorder);
    mailListener.start(config["smtp-port"], logger);

    console.log(SplashScreen.computeSplashScreen(config));
    
    return 0;
}

function processArgv(argv: string[]): Config {
    switch( argv.length ) 
    {
      case 2: return DefaultConfig; 
      case 3: throw new Error('Missing argument: ./path/to/config.json');
      case 4: if( argv[2] === '--config' ) {
          return JSON.parse(fs.readFileSync(argv[2], 'utf8'))
        }  else {
          throw new Error('Bad argument');
        } 
      default:  
        throw new Error('Bad argument');
    }
  }
