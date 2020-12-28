import { mocked } from 'ts-jest/utils';
import {main} from '../Main';
import DbConnector from "../DbConnector";
import MailListener from "../MailListener";
import MailRecorderToDb from '../MailRecorderToDb';
import Logger from '../Logger';
import SplashScreen from '../SplashScreen';

import DefaultConfig from '../default.config.json';

import mockConsole from "jest-mock-console";

jest.mock('../Logger');
jest.mock('../DbConnector');
jest.mock('../MailListener');
jest.mock('../MailRecorderToDb');

describe('Main', ()=> {
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
            main(['node', 'index.js', '--config', 'config.json', 'foo']);
        }).toThrow(Error);

        expect(DbConnector).not.toHaveBeenCalled();
        expect(MailListener).not.toHaveBeenCalled();
        expect(MailRecorderToDb).not.toHaveBeenCalled();
    });

    it('should run with the default argument', ()=> {

        const restoreConsole = mockConsole();

        const mockLoggerCreate = jest.fn().mockImplementationOnce(() => 'mockLogger');
        Logger.create = mockLoggerCreate;

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

        expect(MailListener).toHaveBeenCalled();
        const mockMailListener  = mocked(MailListener,true);
        expect(mockMailListener.mock.instances[0].subscribe).toHaveBeenLastCalledWith(mockMailRecorderToDb.mock.instances[0]);
        expect(mockMailListener.mock.instances[0].start).toHaveBeenLastCalledWith(DefaultConfig['smtp-port'], 'mockLogger');

        expect(mockSplashScreen).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalled();

        restoreConsole();
    });
});
