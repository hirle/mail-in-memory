export default class Mail {
    messageId: string;
    fromAddress: string;
    toAddress: string;
    subject?: string;
    body: string;
    mailTimestamp: Date;

    constructor( messageId: string,fromAddress: string, toAddress: string, subject: string|undefined, body: string, mailTimestamp: Date ){
        this.messageId = messageId;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.subject = subject;
        this.body = body;
        this.mailTimestamp = mailTimestamp;
    }

    static create( data: MailInterface): Mail {
        return new Mail(
            data.messageId,
            data.fromAddress,
            data.toAddress,
            data.subject,
            data.body,
            new Date(data.mailTimestamp)
            );
    }
}

export interface MailInterface {
    messageId: string;
    fromAddress: string;
    toAddress: string;
    subject?: string;
    body: string;
    mailTimestamp: Date|string|number;
}