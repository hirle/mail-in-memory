import DbConnector from "./DbConnector";
import MailListener from "./MailListener";
import MailMessageEmitter from "./MailMessageEmitter";
import MailRecorderToDb from "./MailRecorderToDb";
import DefaultConfig from './default.config.json';
import Config from './Config';
import fs from 'fs';
import Logger from "./Logger";
import SplashScreen from "./SplashScreen";
import Web from "./Web";
import GetLatestMailsRequestHandler from "./GetLatestMailsRequestHandler";
import GetMailsSinceRequestHandler from "./GetMailsSinceRequestHandler";
import GetMailsForRequestHandler from "./GetMailsForRequestHandler";

export function main(argv: string[]): number {
    
    const config = processArgv(argv);

    const logger: Logger = Logger.create(config.logs);

    const mailListener = new MailListener();

    const dbConnector = new DbConnector(config.db);
    
    const web = new Web(config);
    
    const mailRecorder: MailRecorderToDb = new MailRecorderToDb(dbConnector);
    mailListener.subscribe(mailRecorder);

    const mailMessageEmitter: MailMessageEmitter = new MailMessageEmitter(web);
    mailListener.subscribe(mailMessageEmitter);

    web.startOn();

    setupApiRoutes(web, dbConnector );

    mailListener.start(config["smtp-port"], logger);

    console.log(SplashScreen.computeSplashScreen(config));
    
    return 0;
}

function setupApiRoutes( web: Web, dbConnector: DbConnector ) {
  const latestMailsRequestHandle = GetLatestMailsRequestHandler.create(dbConnector);
  web.recordGetRoute('/api/mails/latest', latestMailsRequestHandle);

  const sinceMailsRequestHandle = GetMailsSinceRequestHandler.create(dbConnector);
  web.recordGetRoute('/api/mails/since/:isodate', sinceMailsRequestHandle);

  const forMailsRequestHandle = GetMailsForRequestHandler.create(dbConnector);
  web.recordGetRoute('/api/mails/for/:isoduration', forMailsRequestHandle);

}

function processArgv(argv: string[]): Config {
    switch( argv.length ) 
    {
      case 2: return DefaultConfig; 
      case 3: throw new Error('Missing argument: ./path/to/config.json');
      case 4: if( argv[2] === '--config' ) {
          return JSON.parse(fs.readFileSync(argv[3], 'utf8'))
        }  else {
          throw new Error('Bad argument');
        } 
      default:  
        throw new Error('Bad argument');
    }
  }
