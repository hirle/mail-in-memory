import fetchMock from 'fetch-mock-jest';
import * as api from '../api';
import { DateTime, Duration } from 'luxon';

describe('api', () => {

    const loveMail =  {
        fromAddress: 'romeo@shakespeare.tragedy.org',
        toAddress: 'juliet@shakespeare.tragedy.org',
        subject: 'Love letter',
        body: 'I love you',
        mailTimestamp: new Date()
    }

    afterEach(() => fetchMock.mockReset())
    
    it('should call /api/mails/latest', () => {

        fetchMock.once({url:'/api/mails/latest', query: {count:10}, method: 'GET'}, [loveMail]);

        return api.GetLastEmails(10).then(mails => {
            expect(mails).toMatchObject([loveMail]);
            expect(fetchMock.called('/api/mails/latest?count=10')).toBeTruthy();
            expectCommonOptions(fetchMock.lastOptions());
        });
    });

    it('should call /api/mails/for', () => {

        fetchMock.once({url:'/api/mails/for/PT3H', method: 'GET'}, [loveMail]);

        return api.GetEmailsFor(Duration.fromObject({hours:3})).then(mails => {
            expect(mails).toMatchObject([loveMail]);
            expectCommonOptions(fetchMock.lastOptions());
        });
    });

    it('should call /api/mails/since', () => {

        fetchMock.once(
            {url:'/api/mails/since/1984-01-24T00:00:00.000Z', method: 'GET'},
            [loveMail]
            );

        return api.GetEmailsSince(DateTime.fromObject({year:1984,month:1,day:24,zone:'utc'})).then(mails => {
            expect(mails).toMatchObject([loveMail]);
            expectCommonOptions(fetchMock.lastOptions());
        });
    });

    function expectCommonOptions(options: any) {
        expect(options.headers).toMatchObject({ Accept: 'application/json'});
    }   
});