import { Mail } from "@mail-in-memory/model";
import Web from "./Web";
import MailConsumer from "./MailConsumer";

export default class MailMessageEmitter extends MailConsumer {

    private web: Web;

    constructor( web: Web ) {
        super();

        this.web = web;
    }

    onNewMail( newMail: Mail): Promise<void> {
        this.web.emitNewMail( newMail );
        return Promise.resolve();
    } 

}