const nodeMailin = require('node-mailin');
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