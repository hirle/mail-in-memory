import { Mail } from "@mail-in-memory/model";

export default abstract class MailConsumer {
    abstract onNewMail( newMail: Mail ): Promise<void>;
}