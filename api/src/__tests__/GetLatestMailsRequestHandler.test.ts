import { mocked } from 'ts-jest/utils';
import { Request, Response} from 'express-serve-static-core';
import { NextFunction } from 'express';
import DbConnector from '../DbConnector';
import GetLatestMailsRequestHandler from '../GetLatestMailsRequestHandler';

jest.mock('../DbConnector');

describe('GetLatestMailsRequestHandler', () => {

    it('should return mails with a 200 status code', ()=>{
        const mockedObjConnector = new DbConnector({filename: 'foo.bar'});
        mockedObjConnector.getLatestMails = jest.fn().mockResolvedValueOnce([]);

        const underTest: (req: Request, res: Response, next: NextFunction) => void = GetLatestMailsRequestHandler.create(mockedObjConnector);


        const mockNextFonction = jest.fn();
        const testReq: any = {  params: {}, query: {} };
        const mockStatus = jest.fn();
        const mockSend = jest.fn().mockImplementationOnce( payload => {
            expect(payload).toEqual([]);
            expect( mockStatus ).toHaveBeenCalledWith(200);
            expect( mockSend ).toHaveBeenCalled();
        });
        mockStatus.mockImplementationOnce( () => ({ send: mockSend }) );
        const testRep: any = { status: mockStatus };

        underTest( testReq, testRep, mockNextFonction );

        const mockDbConnector  = mocked(DbConnector,true);
        expect(mockDbConnector.mock.instances[0].getLatestMails).toHaveBeenCalled();

    });
});
