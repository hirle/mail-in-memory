import { mocked } from 'ts-jest/utils';
import SocketIo from '../SocketIo';
import io from 'socket.io-client';

jest.mock('socket.io-client');

describe('SocketIo', () => {
    it('should register observer and run their callbacks', ( ) => {

        const underTest = new SocketIo();
        underTest.startOn('/socketio');

        const mockIo = mocked(io);
        expect(mockIo).toHaveBeenCalled();
        
        const fooCallBack1 = jest.fn();
        const fooCallBack2= jest.fn();
        const barCallBack = jest.fn();

        underTest.addObserver('foo', fooCallBack1);
        underTest.addObserver('foo', fooCallBack2);
        underTest.addObserver('bar', barCallBack);

        underTest.notify('foo', {foo:true});
        expect(fooCallBack1).toHaveBeenCalledTimes(1);
        expect(fooCallBack2).toHaveBeenCalledTimes(1);
        expect(barCallBack).not.toHaveBeenCalled();


        underTest.notify('bar', {bar:true});
        expect(fooCallBack1).toHaveBeenCalledTimes(1);
        expect(fooCallBack2).toHaveBeenCalledTimes(1);
        expect(barCallBack).toHaveBeenCalledTimes(1);

        underTest.notify('nothing registered', {nothing:true});
        expect(fooCallBack1).toHaveBeenCalledTimes(1);
        expect(fooCallBack2).toHaveBeenCalledTimes(1);
        expect(barCallBack).toHaveBeenCalledTimes(1);

    });

    it('should return whethter it is connected', ( ) => {
        const underTest = new SocketIo();
        expect(underTest.isConnected()).toBeFalsy();

        // TO DO test the connected case
    });    
});