import DbConnector from '../DbConnector';
import {Mail} from '@mail-in-memory/model';

describe('DbConnector', () => {
    it('should connect the db, create 1 record', () => {
        const config = {
            filename: ':memory:'
        };

        const conn = new DbConnector(config);
        return conn.connect()
            .then( () => {
                const testMail = new Mail('expeditor@domain.org', 'destinator@localhost', 'subject', 'this is a long text', new Date());
                return conn.recordMail(testMail);
            })
            .then( () => {
                return conn.getLatestMails(1)
                    .then( mails => {
                        expect(mails).toHaveLength(1);
                        const mail = mails[0];
                        expect(mail.fromAddress).toBe('expeditor@domain.org');
                        expect(mail.toAddress).toBe('destinator@localhost');
                        return Promise.resolve();
                    });
            })
            .then( () => conn.disconnect() );
    });
});