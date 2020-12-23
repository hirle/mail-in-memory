export default abstract class MailProcessor {
    abstract onNewMail( from: string, to: string, subject: string, content: string, timestamp: Date): Promise<void>;
}