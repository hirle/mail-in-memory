import { Request, Response} from 'express-serve-static-core';
import { NextFunction } from 'express';
import DbConnector from '../DbConnector';
import GetMailsSinceRequestHandler from '../GetMailsSinceRequestHandler';
import { Mail } from '@mail-in-memory/model';
import { DateTime } from 'luxon';

jest.mock('../DbConnector');

describe('GetMailsSinceRequestHandler', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    });

    it('should return mails with a 200 status code', done =>{

        const loveMail = [
            new Mail(
                '123-456_678',
                'romeo@shakespeare.org',
                'juliet@shakespeare.org',
                'Love letter',
                'I love you so much',
                new Date()
                )
        ]

        const mockedObjConnector = new DbConnector({filename: 'foo.bar'});
        mockedObjConnector.getMailsSince = jest.fn<Promise<Mail[]>, [DateTime]>().mockResolvedValueOnce(loveMail);
        const underTest: (req: Request, res: Response, next: NextFunction) => void = GetMailsSinceRequestHandler.create(mockedObjConnector);

        const aDate = '2021-01-01T10:22Z';
        const mockNextFonction = jest.fn();
        const testReq: any = {  params: { isodate: aDate } };
        const mockStatus = jest.fn();
        const mockSend = jest.fn().mockImplementationOnce( payload => {
            expect(payload).toEqual(loveMail);
            expect( mockStatus ).toHaveBeenCalledWith(200);
            expect( mockSend ).toHaveBeenCalled();

            done();
        });
        mockStatus.mockImplementationOnce( () => ({ send: mockSend }) );
        const testRes: any = { status: mockStatus };

        underTest( testReq, testRes, mockNextFonction );

        expect(mockedObjConnector.getMailsSince).toHaveBeenCalled();
        expect((mockedObjConnector.getMailsSince as jest.Mock<Promise<Mail[]>, [DateTime]>).mock.calls[0][0]).toEqual(DateTime.fromISO(aDate));
    });

    it('should call next handler if invalid date', () =>{

        const mockedObjConnector = new DbConnector({filename: 'foo.bar'});
        mockedObjConnector.getMailsSince = jest.fn<Promise<Mail[]>, [DateTime]>();
        const underTest: (req: Request, res: Response, next: NextFunction) => void = GetMailsSinceRequestHandler.create(mockedObjConnector);

        const aDate = 'not a valid date';
        const mockNextFunction = jest.fn();
        const testReq: any = {  params: { isodate: aDate } };
        const mockStatusFunction = jest.fn();
        const testRes: any = { status: mockStatusFunction };

        expect( () => underTest( testReq, testRes, mockNextFunction ) ).toThrowError();

        expect(mockedObjConnector.getMailsSince).not.toHaveBeenCalled();
        expect(mockStatusFunction).not.toHaveBeenCalled();
        expect(mockNextFunction).not.toHaveBeenCalled();
    });


    it('should call next in case of error', done =>{

        const mockedObjConnector = new DbConnector({filename: 'foo.bar'});
        mockedObjConnector.getMailsSince = jest.fn().mockRejectedValueOnce(new Error('rainy day'));

        const underTest: (req: Request, res: Response, next: NextFunction) => void = GetMailsSinceRequestHandler.create(mockedObjConnector);

        const testReq: any = {  params: { isodate: (new Date()).toISOString() } };
        const mockStatus = jest.fn();
        const testRes: any = { status: mockStatus };
        const mockNextFonction = jest.fn().mockImplementationOnce( err => {

            expect(err).toBeInstanceOf(Error);
            expect(mockStatus).not.toHaveBeenCalled();

            done();
        });

        underTest( testReq, testRes, mockNextFonction );

    });
});
