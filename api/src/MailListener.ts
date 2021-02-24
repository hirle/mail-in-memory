const nodeMailin = require('node-mailin');
import { v4 as uuidv4 } from 'uuid';
import MailConsumer from './MailConsumer';
import { Mail } from '@mail-in-memory/model';
import Logger from './Logger';
export default class MailListener {

    private mailProcessors : MailConsumer[];

    constructor() {
        this.mailProcessors = [];
    }

    subscribe( mailProcessor: MailConsumer) {
        this.mailProcessors.push(mailProcessor);
    }

    start(port: number, logger: Logger ): void {

        nodeMailin.start({
            port,
            disableSpamScore: true,
            logLevel: "warn",
        });

        nodeMailin.on("message", ( _: any, data: any) => {
            const messageId = uuidv4();
            const from = data.from.text;
            const to = data.to.text;
            const subject = data.subject
            const date = data.date ? new Date(data.date) : new Date();
            logger.info('Processing from %s to %s, %s at %s', from, to, subject, date);

            this.mailProcessors.forEach( processor => {
                const newMail = new Mail( messageId, from, to, subject, data.text, new Date(date));
                processor.onNewMail(newMail)
                    .catch( error => logger.error(error));
            })     
          });
           
        nodeMailin.on("error", (error: any) => logger.error(error));
    }
}