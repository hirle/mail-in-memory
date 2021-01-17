import { NextFunction } from 'express';
import { Request, Response } from 'express-serve-static-core';
import { DateTime } from 'luxon';

import DbConnector from "./DbConnector"

export default class GetMailsSinceRequestHandler {

    private dbConnector: DbConnector

    private constructor( dbConnector: DbConnector ) {
        this.dbConnector = dbConnector;
    }

    private handleRequest(req: Request, res: Response, next: NextFunction) {

        const since = DateTime.fromISO(req.params.isodate);
        if( ! since.isValid ) {
            throw new Error('invalid date:' + since.invalidExplanation )
        }
        this.dbConnector.getMailsSince(since)
          .then(mails => {
            res.status(200).send(mails);
          })
          .catch(next);
    }

    static create(dbConnector: DbConnector): (req: Request, res: Response, next: NextFunction) => void {
        const returned = new GetMailsSinceRequestHandler( dbConnector );
        return returned.handleRequest.bind(returned);
    }
}