const nodeMailin = require('node-mailin');
import MailProcessor from './MailProcessor';
import { Mail } from '@mail-in-memory/model';
import Logger from './Logger';

export default class MailListener {

    private mailProcessors : MailProcessor[];

    constructor() {
        this.mailProcessors = [];
    }

    subscribe( mailProcessor: MailProcessor) {
        this.mailProcessors.push(mailProcessor);
    }

    start(port: number, logger: Logger ): void {

        nodeMailin.start({
            port,
            disableSpamScore: true
        });

        nodeMailin.on("message", ( _: any, data: any) => {

            const from = data.from.text;
            const to = data.to.text;
            const subject = data.subject
            logger.info('Processing from %s to %s, %s', from, to, subject)

            this.mailProcessors.forEach( processor => {
                const newMail = new Mail( from, to, subject, data.text, new Date(data.date));
                processor.onNewMail(newMail)
                    .catch( error => logger.error(error));
            })     
          });
           
        nodeMailin.on("error", (error: any) => logger.error(error));
    }
}