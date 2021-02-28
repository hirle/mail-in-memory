import io from 'socket.io-client';

export type NotifyEvent = (data: any) => void;

export default class SocketIo {

    private socket?: SocketIOClient.Socket;
    private observers: Map<string, NotifyEvent[]>;

    constructor() {
        this.socket = undefined;
        this.observers = new Map<string, NotifyEvent[]>();
    }

    public startOn(path: string) {
        this.socket = io(path);
    }

    public stop() {
        // TODO code the stop
        console.log('not implemented yet');
    }

    public addObserver( event: string, notifyEvent: NotifyEvent ){
        if( ! this.observers.has(event)) {
            this.observers.set(event, []);
            this.socket?.on(event, this.notify.bind(this, event))
        }
        this.observers.get(event)!.push(notifyEvent);
    }

    public isConnected(): boolean {
        return !!this.socket && this.socket.connected;
    }

    public notify(event: string, data: any){
        if( this.observers.has(event) ) {
            this.observers.get(event)!.forEach( notifyEvent => notifyEvent(data));
        }
    }

}