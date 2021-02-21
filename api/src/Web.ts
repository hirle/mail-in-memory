import express, { RequestHandler } from 'express';
import * as bodyParser from 'body-parser';
import { Server } from 'http';
import socketIO from 'socket.io';
import Config from './Config';
import {Mail, SocketMessages} from '@mail-in-memory/model';

export default class Web {

    private config: Config;
    private app: express.Application;
    private server: Server;
    private io: socketIO.Server;

    constructor(config: Config) {
        this.app = express()
        this.config = config;
        this.server = new Server(this.app)
        this.io = socketIO(this.server);
    }
    
    startOn( ) {

        this.app.use('/static', express.static('static'));
        this.app.use(bodyParser.json());

        this.app.all('*', (req, _, next) => {
            console.log(req.method + ' ' + req.url)
            next()
        });

        this.app.get('/', (_, res) => {
            res.redirect('/static/index.html');
        })

        this.server.listen(this.config['http-port'], () => {
            console.log(`Listening on ${this.config['http-port']}`)
        });
    }

    recordGetRoute(path: string, requestHandler: RequestHandler ): void {
        this.app.get(path, requestHandler);
    }

    emitNewMail(newMail: Mail) {
        this.io.emit(SocketMessages.NewMail, newMail);
    }
}