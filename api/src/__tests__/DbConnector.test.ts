import DbConnector from '../DbConnector';
import { Mail} from '@mail-in-memory/model';
import { withFile } from 'tmp-promise';
import { DateTime, Duration } from 'luxon';

describe('DbConnector', () => {

    const now = DateTime.utc();
    const mailLastYear = new Mail('expeditor@domain.org', 'destinator@localhost', 'very old', 'should not be selected', now.minus( { year: 1 } ).toJSDate() );
    const recentMail = new Mail('expeditor@domain.org', 'destinator@localhost', 'very recent', 'should be selected', now.toJSDate() );
    const anotherRecentMail = new Mail('expeditor@domain.org', 'destinator@localhost', 'recent', 'should be selected', now.minus({ minute: 1 }).toJSDate() );
    const oneDay: Duration = Duration.fromObject({ day: 1 });

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

    it('should get mails for a given duration', () => {

        return testGetRecentMails( (conn: DbConnector) => conn.getMailsFor(oneDay) );
    }); 

    it('should get mails since a given date', () => {

        return testGetRecentMails( (conn: DbConnector) => conn.getMailsSince(now.minus(oneDay)));
    });

    function testGetRecentMails( getFunc: (conn: DbConnector) => Promise<Mail[]> ): Promise<void> {

        const config = {
            filename: ':memory:'
        };

        const conn = new DbConnector(config);
        return Promise.all([
                conn.recordMail(mailLastYear),
                conn.recordMail(recentMail),
                conn.recordMail(anotherRecentMail)
            ])
            .then(() => {
                return getFunc(conn)
                    .then(mails => {
                        expect(mails).toHaveLength(2);
                        expect(mails.every(mail => mail.body === 'should be selected')).toBeTruthy();
                        expect(mails[0].subject).toBe('very recent');
                        expect(mails[1].subject).toBe('recent');
                        return Promise.resolve();
                    });
            })
            .then(() => conn.disconnect());

    };


    function testDbOnConfig(config: { filename: string; }) {
        const conn = new DbConnector(config);
        return conn.recordMail(recentMail)
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
});

