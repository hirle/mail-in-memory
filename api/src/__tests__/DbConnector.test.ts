import DbConnector from '../DbConnector';
import {Mail} from '@mail-in-memory/model';
import { withFile } from 'tmp-promise';

describe('DbConnector', () => {
    it('should connect the db in memory, create 1 record and fetch it', () => {
        const config = {

            filename: ':memory:'
        };

        return testDbOnConfig(config);
    });

    it('should connect the db on file, create 1 record and fetch it', () => {

        return withFile(({path}) => {
            const config = {
                filename: path
            };
            return testDbOnConfig(config);
        });
    });

});

function testDbOnConfig(config: { filename: string; }) {
    const conn = new DbConnector(config);
    const testMail = new Mail('expeditor@domain.org', 'destinator@localhost', 'subject', 'this is a long text', new Date());
    return conn.recordMail(testMail)
        .then(() => {
            return conn.getLatestMails(1)
                .then(mails => {
                    expect(mails).toHaveLength(1);
                    const mail = mails[0];
                    expect(mail.fromAddress).toBe('expeditor@domain.org');
                    expect(mail.toAddress).toBe('destinator@localhost');
                    return Promise.resolve();
                });
        })
        .then(() => conn.disconnect());
}
