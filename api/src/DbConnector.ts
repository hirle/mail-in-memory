import 'sqlite3';
import { DatabaseConfig } from './Config';
import Knex from 'knex';
import {Mail, MailInterface} from '@mail-in-memory/model';
import {DateTime, Duration} from 'luxon';

export default class DbConnector {

    private readyDb: Promise<Knex>;
    private static readonly tableName = 'mails';

    constructor(dbConfig: DatabaseConfig) {
        const db = Knex( {
                client: 'sqlite3',
                connection: { filename: dbConfig.filename },
                // 🤔
                useNullAsDefault: true
            });

        this.readyDb = db.schema.hasTable(DbConnector.tableName)
            .then( tableExists => tableExists
                    ? Promise.resolve()
                    : DbConnector.prepareTable(db, DbConnector.tableName))
            .then( () => Promise.resolve(db));
    }

    disconnect(): Promise<void> {
        return this.readyDb.then( db => db.destroy());
    }

    private static prepareTable( db: Knex, tableName :string ): Promise<void> {
        return db.schema.createTable(tableName, table => {
            table.increments('id');
            table.string('fromAddress', 254).notNullable();
            table.string('toAddress', 254).notNullable();
            table.string('messageId', 36).notNullable();
            table.string('subject', 78);
            table.text('body').notNullable();
            table.timestamp('mailTimestamp', { useTz: true }).notNullable();

            table.index(['mailTimestamp'], 'iMailTimestamp');
        });
    }

    recordMail(mail: Mail): Promise<void> {
        return this.readyDb
            .then( db => db(DbConnector.tableName) .insert(mail))
            .then( () => Promise.resolve())
    }

    getLatestMails(count: number): Promise<Mail[]> {
        return this.readyDb
            .then( db => db.select().from<MailInterface>(DbConnector.tableName).limit(count).orderBy('mailTimestamp', 'desc'))
            .then( altmostMails => altmostMails.map( (altmostMail: MailInterface) => Mail.create(altmostMail)));
    }

    getMailsSince( since: DateTime ): Promise<Mail[]> {
        return this.readyDb
            .then( db => db.select()
                            .from<MailInterface>(DbConnector.tableName)
                            .where('mailTimestamp', '>=', since.toJSDate())
                            .orderBy('mailTimestamp', 'desc'))
            .then( altmostMails => altmostMails.map( (altmostMail: MailInterface) => Mail.create(altmostMail)));
    }
    
    getMailsFor( duration: Duration ): Promise<Mail[]> {
        const now = DateTime.local();
        return this.getMailsSince(now.minus(duration));
    }
}