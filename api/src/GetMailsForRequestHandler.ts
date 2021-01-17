import { NextFunction } from 'express';
import { Request, Response } from 'express-serve-static-core';
import { Duration } from 'luxon';

import DbConnector from "./DbConnector"

export default class GetMailsForRequestHandler {

    private dbConnector: DbConnector

    private constructor( dbConnector: DbConnector ) {
        this.dbConnector = dbConnector;
    }

    private handleRequest(req: Request, res: Response, next: NextFunction) {

        const duration = Duration.fromISO(req.params.duration);
        if( ! duration.isValid ) {
            throw new Error('invalid date:' + duration.invalidExplanation )
        }
        this.dbConnector.getMailsFor(duration)
          .then(mails => {
            res.status(200).send(mails);
          })
          .catch(next);
    }

    static create(dbConnector: DbConnector): (req: Request, res: Response, next: NextFunction) => void {
        const returned = new GetMailsForRequestHandler( dbConnector );
        return returned.handleRequest.bind(returned);
    }
}