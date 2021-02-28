import Web from '../Web';
import MailMessageEmitter from '../MailMessageEmitter';
import {Mail} from '@mail-in-memory/model';
import { mocked } from 'ts-jest/utils';

jest.mock('../Web');

describe('MailMessageEmitter', () => {

    const mail = Mail.create({
        messageId: '123-456-789',
        fromAddress: 'expeditor@domain.org',
        toAddress:'destinator@domain.org',
         body: 'building',
         mailTimestamp : new Date()
        });


    it('should emitNewMail on web', () => {

        const mockedWeb = new Web({
                "smtp-port": 3025,
                "http-port": 3300,
                db: {
                    filename : ':memory:'
                }
        });
    
        const underTest = new MailMessageEmitter(mockedWeb);
        return underTest.onNewMail(mail)
            .then( () => {
                expect( mockedWeb.emitNewMail).toBeCalledWith(mail);
            });
    });
});