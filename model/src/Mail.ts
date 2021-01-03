export default class Mail {

    fromAddress: string;
    toAddress: string;
    subject?: string;
    body: string;
    mailTimestamp: Date;

    constructor( fromAddress: string, toAddress: string, subject: string|undefined, body: string, mailTimestamp: Date ){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.subject = subject;
        this.body = body;
        this.mailTimestamp = mailTimestamp;
    }

    static create( data: MailInterface): Mail {
        return new Mail(data.fromAddress, data.toAddress, data.subject, data.body, new Date(data.mailTimestamp));
    }
}

export interface MailInterface {
    fromAddress: string;
    toAddress: string;
    subject?: string;
    body: string;
    mailTimestamp: Date|string|number;
}