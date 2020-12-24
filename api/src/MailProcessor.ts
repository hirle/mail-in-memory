import { Mail } from "@mail-in-memory/model";

export default abstract class MailProcessor {
    abstract onNewMail( newMail: Mail ): Promise<void>;
}