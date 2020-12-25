import 'sqlite3';
import { DatabaseConfig } from './Config';
import Knex from 'knex';
import {Mail, MailInterface} from '@mail-in-memory/model';

export default class DbConnector {

    private db: Knex;
    private static readonly tableName = 'mails';

    constructor(dbConfig: DatabaseConfig) {
        this.db = Knex( {
                client: 'sqlite3',
                connection: { filename: dbConfig.filename },
                // 🤔
                useNullAsDefault: true
            });
    }

    connect(): Promise<void> {
        return this.db.schema.hasTable(DbConnector.tableName)
            .then( tableExists => tableExists
                    ? Promise.resolve()
                    : this.prepareTable(DbConnector.tableName) );
    }

    disconnect(): Promise<void> {
        return this.db.destroy();
    }

    private prepareTable( tableName :string ): Promise<void> {
        return this.db.schema.createTable(tableName, table => {
            table.increments('id');
            table.string('fromAddress', 254).notNullable();
            table.string('toAddress', 254).notNullable();
            table.string('subject', 78);
            table.text('body').notNullable();
            table.timestamp('mailTimestamp', { useTz: true }).notNullable();

            table.index(['mailTimestamp'], 'iMailTimestamp');
        })
    }

    recordMail(mail: Mail): Promise<void> {
        return this.db(DbConnector.tableName)
            .insert(mail)
            .then( () => Promise.resolve())
    }

    getLatestMails(count: number): Promise<Mail[]> {
        return this.db.select().from<MailInterface>(DbConnector.tableName).limit(count).orderBy('mailTimestamp', 'desc')
            .then( altmostMails => altmostMails.map( (altmostMail: MailInterface) => Mail.create(altmostMail)));
    }
}