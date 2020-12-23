import DbConnector from "./DbConnector";
import MailProcessor from "./MailProcessor";

export default class MailRecorderToDb extends MailProcessor {

    private dbConnector: DbConnector;

    constructor( dbConnector: DbConnector ) {
        super();

        this.dbConnector = dbConnector;
    }

    onNewMail( from: string, to: string, subject: string, body: string, timestamp: Date): Promise<void> {
        return this.dbConnector.recordMail(from, to, subject, body, timestamp);
    } 

}