import DbConnector from '../DbConnector';
import MailRecorderToDb from '../MailRecorderToDb';
import {Mail} from '@mail-in-memory/model';

jest.mock('../DbConnector');


describe('MailRecorderToDb', () => {
    it('should call record mail using the db connector', () => {
        const dbConnector: DbConnector = new DbConnector({filename: 'this is a mock'});

        const mail = Mail.create({
            messageId: '123-456-789',
            fromAddress: 'expeditor@domain.org',
            toAddress:'destinator@domain.org',
             body: 'building',
             mailTimestamp : new Date()
            });

        const underTest : MailRecorderToDb = new MailRecorderToDb( dbConnector );
        underTest.onNewMail(mail);
        expect( dbConnector.recordMail).toHaveBeenCalledWith(mail);
        expect( dbConnector.recordMail).toHaveBeenCalledTimes(1);
    });
});
