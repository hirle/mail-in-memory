import { mocked } from 'ts-jest/utils';
import mockConsole from 'jest-mock-console';
import { withFile } from 'tmp-promise';
import { promises as fs } from 'fs';
import {main} from '../Main';
import DbConnector from "../DbConnector";
import MailListener from "../MailListener";
import MailRecorderToDb from '../MailRecorderToDb';
import GetLatestMailsRequestHandler from '../GetLatestMailsRequestHandler';
import Logger from '../Logger';
import Web from '../Web';
import SplashScreen from '../SplashScreen';

import DefaultConfig from '../default.config.json';


jest.mock('../Logger');
jest.mock('../DbConnector');
jest.mock('../MailListener');
jest.mock('../MailRecorderToDb');
jest.mock('../GetLatestMailsRequestHandler');
jest.mock('../Web');

describe('Main', ()=> {

    beforeEach( () => {
        jest.clearAllMocks();
    });

    it('should throw on illegal arguments', ()=> {
        expect(() => {
            main([]);
          }).toThrow(Error);

        expect(() => {
            main(['node']);
        }).toThrow(Error);

        expect(() => {
            main(['node', 'index.js', '--config']);
        }).toThrow(Error);

        expect(() => {
            main(['node', 'index.js', '--not-config', 'something']);
        }).toThrow(Error);

        expect(() => {
            main(['node', 'index.js', '--config', 'config.json', 'foo']);
        }).toThrow(Error);

        expect(DbConnector).not.toHaveBeenCalled();
        expect(MailListener).not.toHaveBeenCalled();
        expect(MailRecorderToDb).not.toHaveBeenCalled();
    });

    it('should run with the default argument and the bind the components together', ()=> {

        const restoreConsole = mockConsole();

        const mockLoggerCreate = jest.fn().mockImplementationOnce(() => 'mockLogger');
        Logger.create = mockLoggerCreate;

        const mockRequestHandler = jest.fn();
        const mockGetLatestMailsRequestHandlerCreate = jest.fn().mockImplementationOnce( () => mockRequestHandler );
        GetLatestMailsRequestHandler.create = mockGetLatestMailsRequestHandlerCreate;

        const mockSplashScreen = jest.fn();
        SplashScreen.computeSplashScreen = mockSplashScreen;

        main(['node', 'index.js']);

        expect(mockLoggerCreate).toHaveBeenCalled();

        expect(DbConnector).toHaveBeenCalled();
        const mockedDbConnector  = mocked(DbConnector);
        expect(mockedDbConnector.mock.calls[0][0].filename).toBe(DefaultConfig.db.filename);

        expect(MailRecorderToDb).toHaveBeenCalled();
        const mockMailRecorderToDb  = mocked(MailRecorderToDb);
        expect(mockMailRecorderToDb.mock.calls[0][0]).toBe(mockedDbConnector.mock.instances[0]);

        expect(mockGetLatestMailsRequestHandlerCreate).toHaveBeenCalledWith(mockedDbConnector.mock.instances[0]);

        expect(MailListener).toHaveBeenCalled();
        const mockMailListener  = mocked(MailListener,true);
        expect(mockMailListener.mock.instances[0].subscribe).toHaveBeenCalledWith(mockMailRecorderToDb.mock.instances[0]);
        expect(mockMailListener.mock.instances[0].start).toHaveBeenLastCalledWith(DefaultConfig['smtp-port'], 'mockLogger');

        expect(Web).toHaveBeenCalled();
        const mockWeb  = mocked(Web,false);
        expect(mockWeb.mock.instances[0].startOn).toHaveBeenCalled();
        expect(mockWeb.mock.instances[0].recordGetRoute).toHaveBeenCalledWith( '/api/mails/latest', mockRequestHandler);

        expect(mockSplashScreen).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalled();

        restoreConsole();
    });

    it('should run with given config file', ()=> {
     
        const testConfigFile =  {
            db: {
                filename: 'valueFromConfigFile'
            }, 
            "smtp-port": 1225,
            "http-port": 1280
        };

        const restoreConsole = mockConsole();

        return withFile( ( {path} ) => {
            return fs.writeFile( path, JSON.stringify(testConfigFile)  )
                .then( () => {
                    main(['node', 'index.js', '--config', path]);
                });
          }).then(() => {
            expect(DbConnector).toHaveBeenCalled();
            const mockedDbConnector  = mocked(DbConnector);
            expect(mockedDbConnector.mock.calls[0][0].filename).toBe('valueFromConfigFile');
          }).then( () => {
              restoreConsole();
          });
    });
});
