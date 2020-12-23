import DbConnector from '../DbConnector';
import { Mail } from '@mail-in-memory/model'

describe('DbConnector', () => {
    it('should test', () => {
        const config = {
            filename: ':memory:'
        };

        const conn = new DbConnector(config);
        return conn.connect()
            .then( () => {
                const testMail = new Mail('hirle.spam+teracom1@free.fr', 'mailin.logger@localhost', 'subject', 'this is a long text', new Date());
                return conn.recordMail(testMail);
            })
            .then( () => conn.disconnect() );
    });
});