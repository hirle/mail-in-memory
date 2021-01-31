import { mocked } from 'ts-jest/utils';
import { Request, Response} from 'express-serve-static-core';
import { NextFunction } from 'express';
import DbConnector from '../DbConnector';
import GetLatestMailsRequestHandler from '../GetLatestMailsRequestHandler';
import { Mail } from '@mail-in-memory/model';

jest.mock('../DbConnector');

describe('GetLatestMailsRequestHandler', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    });

    it('should return mails with a 200 status code', done =>{

        const loveMail = [
            new Mail(
                'romeo@shakespeare.org',
                'juliet@shakespeare.org',
                'Love letter',
                'I love you so much',
                new Date()
                )
        ]

        const mockedObjConnector = new DbConnector({filename: 'foo.bar'});
        mockedObjConnector.getLatestMails = jest.fn().mockResolvedValueOnce(loveMail);

        const underTest: (req: Request, res: Response, next: NextFunction) => void = GetLatestMailsRequestHandler.create(mockedObjConnector);

        const mockNextFonction = jest.fn();
        const testReq: any = {  params: {}, query: { count: 42 } };
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

        const mockDbConnector  = mocked(DbConnector,true);
        expect(mockedObjConnector.getLatestMails).toHaveBeenCalledWith(42);
    });

    it('should call next in case of error', done =>{

        const mockedObjConnector = new DbConnector({filename: 'foo.bar'});
        mockedObjConnector.getLatestMails = jest.fn().mockRejectedValueOnce(new Error('rainy day'));

        const underTest: (req: Request, res: Response, next: NextFunction) => void = GetLatestMailsRequestHandler.create(mockedObjConnector);

        const testReq: any = {  params: {}, query: {} };
        const mockStatus = jest.fn();
        const testRes: any = { status: mockStatus };
        const mockNextFonction = jest.fn().mockImplementationOnce( err => {

            expect(err).toBeInstanceOf(Error);
            expect(mockStatus).not.toHaveBeenCalled();

            done();
        });

        underTest( testReq, testRes, mockNextFonction );

    });

    it('should use default count if none provided', done =>{
        const mockedObjConnector = new DbConnector({filename: 'qux.quux'});
        mockedObjConnector.getLatestMails = jest.fn().mockResolvedValueOnce([]);

        const underTest: (req: Request, res: Response, next: NextFunction) => void = GetLatestMailsRequestHandler.create(mockedObjConnector);

        const mockNextFonction = jest.fn();
        const testReq: any = {  params: {}, query: { } };
        const mockStatus = jest.fn();
        const mockSend = jest.fn().mockImplementationOnce( payload => {
            expect(payload).toEqual([]);
            expect( mockStatus ).toHaveBeenCalled();
            expect( mockSend ).toHaveBeenCalled();

            done();
        });
        mockStatus.mockImplementationOnce( () => ({ send: mockSend }) );
        const testRes: any = { status: mockStatus };

        underTest( testReq, testRes, mockNextFonction );

        expect(mockedObjConnector.getLatestMails).toHaveBeenCalledWith(GetLatestMailsRequestHandler.defaultCount);
    });
});
