import { Mail } from "@mail-in-memory/model";
import DbConnector from "./DbConnector";
import MailConsumer from "./MailConsumer";

export default class MailRecorderToDb extends MailConsumer {

    private dbConnector: DbConnector;

    constructor( dbConnector: DbConnector ) {
        super();

        this.dbConnector = dbConnector;
    }

    onNewMail( newMail: Mail): Promise<void> {
        return this.dbConnector.recordMail(newMail);
    } 
}